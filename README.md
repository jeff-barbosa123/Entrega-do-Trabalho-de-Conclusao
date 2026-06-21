# Trabalho de Conclusão – Programação de Automação de Teste

Projeto com **testes automatizados** (Mocha) integrado a uma **pipeline de CI no GitHub Actions**, que executa os testes, gera um **relatório** e o disponibiliza como artefato da pipeline.

---

## 1. Sobre o projeto

O objetivo do trabalho é configurar uma pipeline de integração contínua (CI) para um projeto com testes automatizados, contemplando:

- Execução automática dos testes a cada alteração no código;
- Três formas de disparo da pipeline (manual, agendada e por push);
- Geração de um relatório de testes compatível com o framework, com upload para a pipeline;
- Documentação dos conceitos aplicados (este README).

O framework de testes utilizado é o **[Mocha](https://mochajs.org/)**, e os relatórios são gerados com **[mochawesome](https://github.com/adamgruber/mochawesome)** (HTML + JSON) e **[mocha-junit-reporter](https://github.com/michaelleeallen/mocha-junit-reporter)** (XML no padrão JUnit).

---

## 2. Estrutura do projeto

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # Definição da pipeline (GitHub Actions)
├── src/                        # Código-fonte da aplicação
├── test/                       # Testes automatizados (*.test.js)
├── reporters.config.json       # Configuração dos relatórios (mochawesome + JUnit)
├── package.json                # Dependências e scripts
├── package-lock.json           # Versões travadas das dependências
└── README.md
```

> A pasta `test-report/` (com os relatórios gerados) e `node_modules/` estão no `.gitignore`, pois são produzidas a cada execução e não devem ser versionadas. Na pipeline, o relatório é publicado como **artefato**.

---

## 3. Como executar localmente

Pré-requisitos: **Node.js 20+** instalado.

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar os testes (saída no console)
npm test

# 3. Rodar os testes E gerar o relatório (HTML + JSON + JUnit)
npm run test:report
```

Após o passo 3, o relatório fica disponível em:

- `test-report/relatorio.html` — relatório visual (abra no navegador)
- `test-report/relatorio.json` — relatório em JSON
- `test-report/junit.xml` — resultado no padrão JUnit

---

## 4. A pipeline de CI (GitHub Actions)

A pipeline está definida em [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Ela roda em um ambiente `ubuntu-latest` provisionado automaticamente pelo GitHub a cada disparo.

### 4.1. Formas de disparo (`on`)

A pipeline pode ser acionada de **três formas**, conforme o enunciado:

| Forma | Gatilho no YAML | Quando acontece |
|-------|-----------------|-----------------|
| **Por push** | `push` | A cada `git push` nas branches `main`/`master` |
| **Agendada** | `schedule` (cron) | Diariamente às 03:00 UTC (00:00 no horário de Recife) |
| **Manual** | `workflow_dispatch` | Sob demanda, pelo botão *"Run workflow"* na aba **Actions** |

```yaml
on:
  push:
    branches: [ main, master ]
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:
```

### 4.2. Etapas (steps) do job

1. **Checkout do código** — baixa o repositório no runner (`actions/checkout`).
2. **Configurar Node.js** — instala o Node 20 e habilita cache do npm (`actions/setup-node`).
3. **Instalar dependências** — `npm ci`, que instala exatamente as versões travadas no `package-lock.json` (build reproduzível).
4. **Executar testes e gerar relatório** — `npm run test:report`. Se algum teste falhar, o passo retorna código de saída ≠ 0 e a pipeline é marcada como **falha**.
5. **Upload do relatório** — publica a pasta `test-report/` como **artefato** baixável (`actions/upload-artifact`). Usa `if: always()` para enviar o relatório mesmo quando algum teste falha.
6. **Publicar resumo dos testes** — exibe o resultado (JUnit) diretamente na aba Actions do run (`dorny/test-reporter`).

### 4.3. Onde encontrar o relatório após a execução

1. Acesse a aba **Actions** do repositório no GitHub;
2. Abra a execução desejada do workflow *"CI - Testes Automatizados"*;
3. O resumo dos testes aparece como um *check* da própria execução;
4. Na seção **Artifacts** (rodapé da execução), baixe **`relatorio-de-testes`** — ele contém o HTML, o JSON e o XML.

---

## 5. Conceitos aplicados

- **Integração Contínua (CI):** automatização da execução dos testes a cada mudança no código, garantindo feedback rápido e evitando regressões.
- **Testes automatizados (Mocha):** suíte de testes descrita com `describe`/`it` e asserções (`assert`), executável de forma repetível por comando.
- **Pipeline como código:** toda a configuração da automação versionada no próprio repositório (`ci.yml`), permitindo histórico e revisão.
- **Gatilhos de execução:** três formas de disparo (`push`, `schedule`/cron e `workflow_dispatch`) cobrindo cenários de integração, rotina e execução sob demanda.
- **Build reproduzível:** uso de `npm ci` com `package-lock.json` para garantir as mesmas versões de dependências em qualquer ambiente.
- **Relatórios de teste:** geração de relatório compatível com o framework (mochawesome para visualização humana; JUnit XML para integração com ferramentas/actions).
- **Artefatos:** persistência do relatório gerado na execução, disponível para download na pipeline.
- **Controle de fluxo na pipeline:** uso de `if: always()` para garantir a publicação do relatório mesmo em caso de falha dos testes, e de `permissions` mínimas necessárias.

---

## 6. Tecnologias e ferramentas

| Item | Ferramenta |
|------|-----------|
| Runtime | Node.js 20 |
| Framework de testes | Mocha |
| Relatório (HTML/JSON) | mochawesome |
| Relatório (XML) | mocha-junit-reporter |
| Combinação de reporters | mocha-multi-reporters |
| CI/CD | GitHub Actions |

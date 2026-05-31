const assert = require('assert');
const ServicoDePagamento = require('../src/ServicoDePagamento');

describe('ServicoDePagamento', () => {

  it('deve registrar pagamento com categoria "cara" quando valor > 100', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('0987-7656-3475', 'Samar', 156.87);
    const ultimo = servico.consultarUltimoPagamento();

    assert.strictEqual(ultimo.codigoBarras, '0987-7656-3475');
    assert.strictEqual(ultimo.empresa, 'Samar');
    assert.strictEqual(ultimo.valor, 156.87);
    assert.strictEqual(ultimo.categoria, 'cara');
  });

  it('deve registrar pagamento com categoria "padrão" quando valor <= 100', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('1111-2222-3333', 'Empresa X', 50.00);
    const ultimo = servico.consultarUltimoPagamento();

    assert.strictEqual(ultimo.categoria, 'padrão');
  });

  it('deve retornar apenas o último pagamento', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('0001', 'A', 10);
    servico.pagar('0002', 'B', 200);
    const ultimo = servico.consultarUltimoPagamento();

    assert.strictEqual(ultimo.codigoBarras, '0002');
  });

  it('deve retornar null se não houver pagamentos', () => {
    const servico = new ServicoDePagamento();
    assert.strictEqual(servico.consultarUltimoPagamento(), null);
  });

});
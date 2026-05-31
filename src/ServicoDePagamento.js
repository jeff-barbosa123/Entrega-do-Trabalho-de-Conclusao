class ServicoDePagamento {
  constructor() {
    this.pagamentos = [];
  }

  pagar(codigoBarras, empresa, valor) {
    const categoria = valor > 100 ? 'cara' : 'padrão';
    const pagamento = { codigoBarras, empresa, valor, categoria };
    this.pagamentos.push(pagamento);
  }

  consultarUltimoPagamento() {
    if (this.pagamentos.length === 0) return null;
    return this.pagamentos[this.pagamentos.length - 1];
  }
}

module.exports = ServicoDePagamento;
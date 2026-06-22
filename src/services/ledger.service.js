/**
 * Servicio de Libro Mayor / Ledger (SRP).
 * Responsabilidad única: aplicar la deducción/crédito de saldos y persistir
 * el registro de la transacción en el historial en memoria.
 */
class LedgerService {
  constructor(transactionsHistory) {
    this.transactionsHistory = transactionsHistory;
  }

  applyTransfer(sender, receiver, amount) {
    sender.balance -= amount;
    receiver.balance += amount;

    const newTransaction = {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: sender.accountAlpha,
      to: receiver.accountAlpha,
      amount: amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };

    this.transactionsHistory.push(newTransaction);
    return newTransaction;
  }
}

module.exports = LedgerService;
/**
 * Servicio de Transacciones (Orquestador).
 * Aplica DIP (Dependency Inversion Principle): no instancia sus dependencias
 * directamente, las recibe inyectadas por constructor como abstracciones.
 */
class TransactionService {
  constructor(validationService, ledgerService, notificationService) {
    this.validationService = validationService;
    this.ledgerService = ledgerService;
    this.notificationService = notificationService;
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    // Delega la validación al servicio correspondiente
    const { sender, receiver } = this.validationService.validateTransfer(
      fromAccountId,
      toAccountId,
      amount
    );

    // Delega la actualización de saldos e historial al ledger
    const newTransaction = this.ledgerService.applyTransfer(sender, receiver, amount);

    // Delega el envío de notificaciones al servicio de notificaciones
    this.notificationService.notifyTransfer(sender, receiver, amount);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }

  getAccountBalance(accountId) {
    const account = this.validationService.getAccount(accountId);
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = TransactionService;
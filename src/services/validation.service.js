/**
 * Servicio de Validación Financiera (SRP).
 * Responsabilidad única: verificar la existencia de cuentas y las reglas de negocio
 * antes de ejecutar una transferencia.
 */
class ValidationService {
  constructor(usersDb) {
    this.usersDb = usersDb;
  }

  validateTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.usersDb.find(u => u.accountAlpha === fromAccountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
    }

    const receiver = this.usersDb.find(u => u.accountAlpha === toAccountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
    }

    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }

    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
    }

    return { sender, receiver };
  }

  getAccount(accountId) {
    const account = this.usersDb.find(u => u.accountAlpha === accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return account;
  }
}

module.exports = ValidationService;
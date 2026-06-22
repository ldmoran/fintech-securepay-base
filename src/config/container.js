/**
 * Contenedor de Inyección de Dependencias (DIP).
 * Instancia y ensambla todos los servicios, inyectando las dependencias
 * necesarias en cada constructor. Los controladores consumen solo este módulo.
 */
const { usersDb, transactionsHistory } = require('./database');

const ValidationService  = require('../services/validation.service');
const LedgerService      = require('../services/ledger.service');
const NotificationService = require('../services/notification.service');
const TransactionService = require('../services/transaction.service');

const validationService   = new ValidationService(usersDb);
const ledgerService       = new LedgerService(transactionsHistory);
const notificationService = new NotificationService();

const transactionService  = new TransactionService(
  validationService,
  ledgerService,
  notificationService
);

module.exports = { transactionService };
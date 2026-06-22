/**
 * Simulación de Base de Datos en Memoria.
 * Módulo compartido que actúa como fuente única de verdad para los datos
 * de usuarios y el historial de transacciones.
 */
const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

const transactionsHistory = [];

module.exports = { usersDb, transactionsHistory };
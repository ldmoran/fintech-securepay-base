// CRÍTICO: instrument.js debe ser la primera importación del backend
// para que Sentry capture todas las trazas desde el inicio del proceso.
require('dotenv').config();
const Sentry = require('./src/instrument');

const express = require('express');
const routes  = require('./src/routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Montar el enrutador principal en /v1
app.use('/v1', routes);

// Endpoint base informativo
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'fintech-securepay-base',
    description: 'API Fintech SecurePay — Arquitecturas Distribuidas ESPE',
    status: 'ONLINE'
  });
});

// Middleware de errores de Sentry (debe ir DESPUÉS de las rutas)
Sentry.setupExpressErrorHandler(app);

// Handler global de errores operacionales
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor Fintech ejecutándose en: http://localhost:${PORT}`);
  console.log(`   - Login (generar token): POST http://localhost:${PORT}/v1/auth/login`);
  console.log(`   - Balance Alpha:         GET  http://localhost:${PORT}/v1/account-alpha/balance`);
  console.log(`   - Transferencia Beta:    POST http://localhost:${PORT}/v1/transfer-beta/execute`);
  console.log(`======================================================\n`);
});
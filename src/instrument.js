/**
 * Módulo de instrumentación Sentry.
 * CRÍTICO: Este archivo DEBE ser importado como la primera línea de index.js,
 * antes de Express y cualquier otra dependencia, para capturar todas las trazas.
 */
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

module.exports = Sentry;
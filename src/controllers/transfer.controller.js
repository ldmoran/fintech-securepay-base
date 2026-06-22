const Sentry = require('@sentry/node');
const { transactionService } = require('../config/container');

/**
 * Endpoint para ejecutar una transferencia bancaria (Beta).
 * POST /v1/transfer-beta/execute
 *
 * Regla de observabilidad distribuida:
 *   - Errores de validación de negocio (saldo insuficiente, cuenta no existe) → 400, sin Sentry.
 *   - Error operacional de infraestructura (caída de BD) → 500, SE ALERTA a Sentry
 *     con el Tag del userId extraído del JWT para trazabilidad del usuario afectado.
 */
function executeTransfer(req, res) {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
      });
    }

    // SIMULACIÓN DE FALLO OPERACIONAL: error de conexión al clúster de datos.
    // Este throw simula una caída de infraestructura (no un error de negocio).
    throw new Error('Conexión interrumpida con el Clúster de Datos SecurePay');

    // eslint-disable-next-line no-unreachable
    const result = transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
    return res.status(200).json(result);

  } catch (error) {
    // Error operacional: reportar a Sentry con contexto del usuario afectado
    Sentry.withScope(scope => {
      // Adjuntar el userId del JWT como Tag personalizado para trazabilidad
      const userId = req.user ? req.user.sub : 'unknown';
      scope.setTag('affected_user_id', userId);
      scope.setTag('endpoint', 'POST /v1/transfer-beta/execute');
      scope.setExtra('requestBody', req.body);
      Sentry.captureException(error);
    });

    return res.status(500).json({
      error: 'Error operacional del servidor',
      message: error.message
    });
  }
}

module.exports = { executeTransfer };


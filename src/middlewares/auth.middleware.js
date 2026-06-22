const jwt        = require('jsonwebtoken');
const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación Stateless.
 * Extrae el Bearer Token de las cabeceras HTTP, lo verifica con la clave
 * pública RS256 de forma autónoma y adjunta el payload a req.user.
 *
 * Manejo diferenciado de errores (regla de observabilidad distribuida):
 *   - Token expirado o malformado → 401/403 controlado. NO se reporta a Sentry.
 *   - Cualquier otro error inesperado → se propaga al handler global (Sentry lo captura).
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    // Error lógico de seguridad: token expirado o firma inválida.
    // Se responde de forma controlada — NO se alerta a Sentry.
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      return res.status(401).json({
        error: 'Token inválido o expirado',
        message: error.message
      });
    }

    // Error inesperado: se propaga al middleware global para que Sentry lo capture.
    next(error);
  }
}

module.exports = authMiddleware;
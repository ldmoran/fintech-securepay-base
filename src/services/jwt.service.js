const jwt  = require('jsonwebtoken');
const fs   = require('fs');
const path = require('path');

/**
 * Genera un Token JWT firmado con clave privada asimétrica (RS256).
 * El payload incluye los claims estándar: sub, name y exp (2 minutos).
 *
 * @param {Object} user - Objeto con la información del usuario { id, email }.
 * @returns {string} JWT Token firmado.
 */
function signToken(user) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, '../../private.pem'),
    'utf8'
  );

  const payload = {
    sub:  user.id,
    name: user.email
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2m'
  });
}

/**
 * Verifica un Token JWT utilizando la clave pública asimétrica (RS256).
 * No requiere la clave privada — diseño stateless distribuido.
 *
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado si el token es válido.
 */
function verifyToken(token) {
  const publicKey = fs.readFileSync(
    path.join(__dirname, '../../public.pem'),
    'utf8'
  );

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

module.exports = { signToken, verifyToken };
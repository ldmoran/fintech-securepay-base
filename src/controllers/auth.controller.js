const jwtService = require('../services/jwt.service');
const { usersDb } = require('../config/database');

/**
 * Genera un JWT RS256 para un usuario existente en la base de datos.
 * POST /v1/auth/login
 * Body: { "email": "estudiante.alpha@espe.edu.ec" }
 */
function login(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Debe proporcionar el campo email en el cuerpo de la petición.'
      });
    }

    const user = usersDb.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: `No existe un usuario con el email '${email}'.`
      });
    }

    const token = jwtService.signToken(user);

    return res.status(200).json({
      message: 'Autenticación exitosa',
      token,
      expiresIn: '2 minutos',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al generar token',
      message: error.message
    });
  }
}

module.exports = { login };
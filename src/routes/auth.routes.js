const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/auth.controller');

// POST /v1/auth/login — genera JWT RS256 para pruebas
router.post('/login', authController.login);

module.exports = router;



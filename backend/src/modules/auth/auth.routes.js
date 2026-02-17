const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.schema');

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);
router.post('/refresh-token', refreshToken); // refreshToken will handle its own validation

module.exports = router;

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.schema');
const auth = require('../../middlewares/auth.middleware');

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);
router.post('/logout', auth, logout);

module.exports = router;

var express = require('express')
const loginRouter = express.Router();
const { login } = require('../../controllers/login.controller');
loginRouter.post('/login', login);
// loginRouter.post('/loginOtpsent',sendVerificationMail)

module.exports = loginRouter;
var express = require('express')
const loginRouter = express.Router();
const { login, verifyByOtp } = require('../../controllers/login.controller');
loginRouter.post('/login', login);
loginRouter.post('/verifybyotp', verifyByOtp)

module.exports = loginRouter;
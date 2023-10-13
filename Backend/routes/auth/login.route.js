var express = require('express')
const loginRouter = express.Router();
const passport = require('passport');

const { login, verifyByOtp, facebookOAuth, getuserName } = require('../../controllers/login.controller');
const { loginFacebook } = require("../../controllers/facebook")
loginRouter.post('/login', login);
loginRouter.post('/verifybyotp', verifyByOtp)
loginRouter.post('/auth/facebook', passport.authenticate('facebookToken', { session: false }), facebookOAuth);
loginRouter.post('/getuserName', getuserName)
module.exports = loginRouter;
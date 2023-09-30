var express = require('express')
const singUpRouter = express.Router();
const { checkIfUserExists } = require("../../middleware/userexists")
const { signUp, sendVerificationMail } = require('../../controllers/singUp.controller');
singUpRouter.post('/signUp',  signUp);
singUpRouter.post('/Otpsent',checkIfUserExists, sendVerificationMail)

module.exports = singUpRouter;
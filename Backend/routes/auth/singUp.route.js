var express = require('express')
const singUpRouter = express.Router();
const { checkIfUserExists } = require("../../middleware/userexists")
const { signUp, sendVerificationMail } = require('../../controllers/singUp.controller');
singUpRouter.post('/signUp',checkIfUserExists, signUp);
singUpRouter.post('/Otpsent', sendVerificationMail)

module.exports = singUpRouter;
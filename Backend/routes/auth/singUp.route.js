var express = require('express')
const singUpRouter = express.Router();
const { checkIfUserExists } = require("../../middleware/userexists")
const { signUp, updateuser, sendVerificationMail, getuserbyid } = require('../../controllers/singUp.controller');
singUpRouter.post('/signUp', signUp);
singUpRouter.post('/Otpsent', sendVerificationMail)
singUpRouter.post('/getuser', getuserbyid)
singUpRouter.post('/updateuser', updateuser)
module.exports = singUpRouter;
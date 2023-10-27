var express = require('express')
const singUpRouter = express.Router();
const { checkIfUserExists } = require("../../middleware/userexists")
const { signUp, updateuser, sendVerificationMail, blockuser, deleteuser, getalluser, getuserbyid } = require('../../controllers/singUp.controller');
singUpRouter.post('/signUp', signUp);
singUpRouter.post('/Otpsent', sendVerificationMail)
singUpRouter.post('/getuser', getuserbyid)
singUpRouter.post('/updateuser', updateuser)
singUpRouter.get('/getalluser', getalluser)
singUpRouter.post('/deleteuser', deleteuser)
singUpRouter.post('/blockuser', blockuser)
module.exports = singUpRouter;
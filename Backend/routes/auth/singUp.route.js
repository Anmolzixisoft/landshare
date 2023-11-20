var express = require('express')
const singUpRouter = express.Router();
const { checkIfUserExists } = require("../../middleware/userexists")
const { singleUpload } = require('../../middleware/multer')
const { signUp, updateuser, sendVerificationMail, blockuser, requestupdatenumber, createuserbyadmin, deleteuser, getalluser, getuserbyid } = require('../../controllers/singUp.controller');
singUpRouter.post('/signUp', signUp);
singUpRouter.post('/Otpsent', sendVerificationMail)
singUpRouter.post('/getuser', getuserbyid)
singUpRouter.post('/updateuser', singleUpload, updateuser)
singUpRouter.get('/getalluser', getalluser)
singUpRouter.post('/deleteuser', deleteuser)
singUpRouter.post('/blockuser', blockuser)
singUpRouter.post('/createuserbyadmin', createuserbyadmin)
singUpRouter.post('/updatereq', requestupdatenumber)
module.exports = singUpRouter;
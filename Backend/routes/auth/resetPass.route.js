var express = require('express')
const resetRouter = express.Router();
const {resetPass}=require('../../controllers/resetPass.controller')
resetRouter.post('/login', resetPass);


module.exports = resetRouter;
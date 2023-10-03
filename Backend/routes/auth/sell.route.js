var express = require('express')
const sellRouter = express.Router();
const {sellProperty,getProperty} = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', sellProperty);
sellRouter.get('/getproperty',getProperty)


module.exports = sellRouter;
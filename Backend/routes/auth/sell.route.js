var express = require('express')
const sellRouter = express.Router();
const {sellProperty} = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', sellProperty);


module.exports = sellRouter;
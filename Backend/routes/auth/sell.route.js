var express = require('express')
const sellRouter = express.Router();

const { singleUpload } = require('../../middleware/multer');

const { sellProperty, getProperty } = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', singleUpload, sellProperty);
sellRouter.get('/getproperty', getProperty)


module.exports = sellRouter;
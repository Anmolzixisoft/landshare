var express = require('express')
const sellRouter = express.Router();

const { singleUpload } = require('../../middleware/multer');

const { sellProperty, getProperty, getsortlist,getPropertyById ,sortlist} = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', singleUpload, sellProperty);
sellRouter.get('/getproperty', getProperty)
sellRouter.post('/getPropertyById', getPropertyById)
sellRouter.post('/sortlist',sortlist)
sellRouter.get('/getsortlist',getsortlist)

module.exports = sellRouter;
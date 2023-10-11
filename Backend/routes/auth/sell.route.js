var express = require('express')
const sellRouter = express.Router();

const { singleUpload,multiplepUload } = require('../../middleware/multer');

const { sellProperty, getProperty, getsortlist,getsortlistByID,getPropertyById ,sortlist,buyInfo} = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', multiplepUload, sellProperty);
sellRouter.post('/getproperty', getProperty)
sellRouter.post('/getPropertyById', getPropertyById)
sellRouter.post('/sortlist',sortlist)
sellRouter.post('/getsortlist',getsortlist)
sellRouter.post('/buy',buyInfo)
sellRouter.post('/getsortlistByID',getsortlistByID)

module.exports = sellRouter;
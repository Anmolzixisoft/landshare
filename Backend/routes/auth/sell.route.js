var express = require('express')
const sellRouter = express.Router();

const { singleUpload, multiplepUload } = require('../../middleware/multer');

const { sellProperty, getProperty, getsortlist, getsortlistByID, deleteProperty, getPropertyById, sortlist, buyInfo, updateProperty, sold_property } = require("../../controllers/sell.controller")
sellRouter.post('/sellProperty', multiplepUload, sellProperty);
sellRouter.post('/getproperty', getProperty)
sellRouter.post('/getPropertyById', getPropertyById)
sellRouter.post('/sortlist', sortlist)
sellRouter.post('/getsortlist', getsortlist)
sellRouter.post('/buy', buyInfo)
sellRouter.post('/getsortlistByID', getsortlistByID)
sellRouter.post('/updateProperty/:propertyId', singleUpload, updateProperty)
sellRouter.post('/delete_proprty', deleteProperty)
sellRouter.post('/sold_property', sold_property)

module.exports = sellRouter;
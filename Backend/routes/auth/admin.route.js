var express = require('express')
const adminRouter = express.Router();

const { adminLogin, getadmin, updateprofile } = require('../../controllers/admin');
const { singleUpload } = require('../../middleware/multer')
adminRouter.post('/admin-login', adminLogin);
adminRouter.get('/getadmin', getadmin);
adminRouter.post('/updateprofile', singleUpload, updateprofile)


module.exports = adminRouter;
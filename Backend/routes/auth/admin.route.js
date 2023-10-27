var express = require('express')
const adminRouter = express.Router();

const { adminLogin } = require('../../controllers/admin');

adminRouter.post('/admin-login', adminLogin);

module.exports = adminRouter;
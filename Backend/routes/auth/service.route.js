const express = require('express')
const serviceRouter = express.Router()
const { Ourservice,getService } = require('../../controllers/service.controller')
serviceRouter.post('/service', Ourservice)
serviceRouter.get('/getservice',getService)

module.exports = serviceRouter
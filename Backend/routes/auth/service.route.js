const express = require('express')
const serviceRouter = express.Router()
const { Ourservice,getService,Touch } = require('../../controllers/service.controller')
serviceRouter.post('/service', Ourservice)
serviceRouter.get('/getservice',getService)
serviceRouter.post('/touch',Touch)

module.exports = serviceRouter
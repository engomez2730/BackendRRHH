const express = require('express')
const Router = express.Router()
const eppController = require('../controllers/eppController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(eppController.verEpps)
.post(eppController.crearEpp)
.delete(eppController.deleteEpps)


Router
.route('/:id')
.get(eppController.verEpp)
.patch(eppController.actualizarEpp)
.delete(eppController.eliminarEpp)




module.exports = Router
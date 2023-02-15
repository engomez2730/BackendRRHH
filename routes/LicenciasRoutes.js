const express = require('express')
const Router = express.Router()
const licenciasController = require('../controllers/licenciasController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(licenciasController.verLicencias)
.post(licenciasController.crearLicencia)
.delete(licenciasController.deleteLicencias)


Router
.route('/:id')
.get(licenciasController.verLicencia)
.patch(licenciasController.actualizarLicencia)
.delete(licenciasController.eliminarEpp)




module.exports = Router
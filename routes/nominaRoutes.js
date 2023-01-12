const express = require('express')
const Router = express.Router()
const nominaController = require('../controllers/nominaController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(nominaController.verNominas)
.post(nominaController.crearNomina)
.delete(nominaController.eliminarNominas)

Router
.route('/stats/:year')
.get(nominaController.getNominaStats)


Router
.route('/:id')
.patch(nominaController.editarNomina)
.get(nominaController.verNomina)









module.exports = Router
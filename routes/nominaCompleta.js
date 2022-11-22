const express = require('express')
const Router = express.Router()
const nominaCompletaController = require('../controllers/nominaCompletaController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(nominaCompletaController.verNomincaCompleta)
.post(nominaCompletaController.crearNominaCompleta)
.delete(nominaCompletaController.eliminarNominaCompleta)


Router
.route('/:id')
.get(nominaCompletaController.verNominaCompletaOne)









module.exports = Router
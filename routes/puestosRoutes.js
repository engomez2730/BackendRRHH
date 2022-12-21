const express = require('express')
const Router = express.Router()
const puestoController = require('../controllers/puestosController')


Router
.route('/')
.get(puestoController.verPuestos)
.post(puestoController.crearPuesto)
.delete(puestoController.eliminarPuestos)

Router
.route('/:id')
.get(puestoController.verPuesto)
.patch(puestoController.editarPuesto)
.delete(puestoController.eliminarPuesto)


module.exports = Router
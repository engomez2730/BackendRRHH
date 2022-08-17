const express = require('express')
const Router = express.Router()
const entrevistadosController = require('../controllers/personasEntrevistadasController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(entrevistadosController.verEntrevistados)
.post(entrevistadosController.createEntrevistado)


/* Router
.route('/:id')
.get(employeesController.verEmpleado)
.patch(employeesController.editarEmpleado)
.delete(employeesController.eliminarEmpleado)

Router
.route('/ausencias/:id')
.patch(employeesController.ponerAusencia)
.delete(employeesController.eliminarEmpleado) */


module.exports = Router
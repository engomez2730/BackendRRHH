const express = require('express')
const Router = express.Router()
const departamentosController = require('../controllers/departamentosController')
const authController = require('../controllers/authController')

Router
.route('/')
.get(departamentosController.verDepartamentos)
.post(departamentosController.crearDepartamento)
.delete(departamentosController.eliminarDepartamentos)

Router
.route('/empleados')
.get(departamentosController.verDepartamentosEmpleados)


Router
.route('/:id')
.get(departamentosController.verDepartamento)
.patch(departamentosController.editarDepartamento)
.delete(departamentosController.eliminarDepartamento)


module.exports = Router
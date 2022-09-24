const express = require('express')
const Router = express.Router()
const employeesController = require('../controllers/employees')
const authController = require('../controllers/authController')


Router
.route('/')
.get(employeesController.verEmpleados)
.post(authController.crearEmpleado)
.delete(employeesController.eliminarEmpleados)

Router
.route('/:id')
.get(employeesController.verEmpleado)
.patch(authController.protect,employeesController.uploadUserPhoto,employeesController.editarEmpleado)
.delete(employeesController.eliminarEmpleado)

Router
.route('/ausencias/:id')
.patch(employeesController.ponerAusencia)
.delete(employeesController.eliminarEmpleado)


module.exports = Router
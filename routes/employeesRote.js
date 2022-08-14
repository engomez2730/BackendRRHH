const express = require('express')
const Router = express.Router()
const employeesController = require('../controllers/employees')
const authController = require('../controllers/authController')


Router
.route('/')
.get(authController.protect,authController.darPermisos('admin'),employeesController.verEmpleados)
.post(authController.crearEmpleado)
.delete(employeesController.eliminarEmpleados)

Router
.route('/:id')
.get(employeesController.verEmpleado)
.patch(employeesController.editarEmpleado)
.delete(employeesController.eliminarEmpleado)


module.exports = Router
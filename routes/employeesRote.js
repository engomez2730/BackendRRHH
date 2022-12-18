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
.route('/stats/')
.get(employeesController.getEmpleadosStats)

Router
.route('/despidos/:id')
.patch(employeesController.despedirEmpleado)


Router
.route('/vacaciones/:id')
.patch(employeesController.vacaciones)

Router
.route('/nomina/:id')
.patch(employeesController.nomina)

Router
.route('/:id')
.get(employeesController.verEmpleado)
.patch(employeesController.uploadUserPhoto,employeesController.editarEmpleado)
.delete(employeesController.eliminarEmpleado)

Router
.route('/ausencias/:id')
.patch(employeesController.ponerAusencia)
.delete(employeesController.eliminarEmpleado)






module.exports = Router
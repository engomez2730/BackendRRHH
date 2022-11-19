const express = require('express')
const Router = express.Router()
const nominaController = require('../controllers/nominaController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(nominaController.verNominas)
.post(nominaController.crearNomina)
.delete(nominaController.eliminarNominas)
/* 
Router
.route('/despidos/:id')
.patch(employeesController.despedirEmpleado) */









module.exports = Router
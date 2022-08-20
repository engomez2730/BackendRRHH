const express = require('express')
const Router = express.Router()
const vacantesController = require('../controllers/vacantesController')
const authController = require('../controllers/authController')



Router
.route('/')
.get(vacantesController.verVacantes)
.post(vacantesController.createVacante)


Router
.route('/:id')
.get(vacantesController.verVacante)
.patch(vacantesController.editarVacante)
.delete(vacantesController.eliminarVacante)

/* Router
.route('/nuevosolicitante/:id')
.patch(vacantesController.uploadUserPhoto, vacantesController.nuevoSolicitante) */



module.exports = Router
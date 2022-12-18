const express = require('express')
const Router = express.Router()
const vacacionesController = require('../controllers/vacacionesController')

Router
.route('/')
.get(vacacionesController.verVacaciones)
.post(vacacionesController.crearVacaciones)
.delete(vacacionesController.eliminarVacaciones)

Router
.route('/:id')
.get(vacacionesController.verVacacion)
.patch(vacacionesController.editarVacacion)
/* .patch(vacacionesController.actualizarAnuncio)
.delete(vacacionesController.eliminarAnuncio) */


module.exports = Router
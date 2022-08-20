const express = require('express')
const Router = express.Router()
const entrevistadosController = require('../controllers/personasEntrevistadasController')
const authController = require('../controllers/authController')


Router
.route('/')
.get(entrevistadosController.verEntrevistados)
.post(entrevistadosController.createEntrevistado)


Router
.route('/:id')
.get(entrevistadosController.verEntrevistado)
.patch(entrevistadosController.editarEntrevistado)
.delete(entrevistadosController.eliminarEntrevistado)




module.exports = Router
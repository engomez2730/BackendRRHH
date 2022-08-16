const express = require('express')
const Router = express.Router()
const anunciosController = require('../controllers/anunciosController')

Router
.route('/')
.get(anunciosController.verAnuncios)
.post(anunciosController.crearAnuncio)
.delete(anunciosController.eliminarAnuncios)

Router
.route('/:id')
.get(anunciosController.verAnuncio)
.patch(anunciosController.actualizarAnuncio)
.delete(anunciosController.eliminarAnuncio)


module.exports = Router
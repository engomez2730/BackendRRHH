const express = require('express')
const Router = express.Router()
const despidosController = require('../controllers/despidosController')

Router
.route('/')
.get(despidosController.verDespidos)
.delete(despidosController.eliminarDespidos)

Router
.route('/desvincular/:id')
.post(despidosController.desvincular,despidosController.nominaDesvinculo)


Router
.route('/:id')
.post(despidosController.crearDespido,despidosController.nominaDespido)
.get(despidosController.verDespido)
/* .patch(despidosController.actualizarAnuncio)
.delete(despidosController.eliminarAnuncio) */


module.exports = Router
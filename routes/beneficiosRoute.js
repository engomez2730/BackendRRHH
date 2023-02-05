const express = require('express')
const Router = express.Router()
const beneficiosController = require('../controllers/beneficiosController')

Router
.route('/')
.post(beneficiosController.crearBeneficios)
.get(beneficiosController.verBeneficios)
.delete(beneficiosController.eliminarBeneficios)

/* Router
.route('/desvincular/:id')
.post()
 */

Router
.route('/:id')
.patch(beneficiosController.editarBeneficio)
.delete(beneficiosController.eliminarBeneficio)
.get(beneficiosController.verBeneficio)
/* .patch(despidosController.actualizarAnuncio)
.delete(despidosController.eliminarAnuncio) */


module.exports = Router
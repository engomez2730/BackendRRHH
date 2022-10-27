const express = require('express')
const Router = express.Router()
const permisosController = require('../controllers/permisosController')

Router
.route('/')
.get(permisosController.verPermisos)
.post(permisosController.crearPermiso)
.delete(permisosController.deletePermisos)

Router
.route('/:id')
.get(permisosController.verPermiso)
.patch(permisosController.actualizarPermiso)
.delete(permisosController.eliminarPermiso)


module.exports = Router
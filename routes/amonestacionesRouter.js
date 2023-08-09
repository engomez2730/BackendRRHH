const express = require("express");
const Router = express.Router();
const amonestacionesController = require("../controllers/AmonestacionesController");

Router.route("/")
  .post(amonestacionesController.crearAmonestacion)
  .get(amonestacionesController.verAmonestaciones)
  .delete(amonestacionesController.eliminarAmonestaciones);

/* Router
.route('/desvincular/:id')
.post()
 */

Router.route("/:id")
  .patch(amonestacionesController.editarAmonestacion)
  .delete(amonestacionesController.eliminarAmonestacion)
  .get(amonestacionesController.verAmonestacion);
/* .patch(despidosController.actualizarAnuncio)
.delete(despidosController.eliminarAnuncio) */

module.exports = Router;

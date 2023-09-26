const express = require("express");
const Router = express.Router();
const equipoController = require("../controllers/equiposController");

Router.route("/")
  .get(equipoController.verEquipos)
  .post(equipoController.crearEquipo)
  .delete(equipoController.eliminarEquipos);

Router.route("/:id")
  .get(equipoController.verEquipo)
  .patch(equipoController.actualizarEquipo)
  .delete(equipoController.eliminarEquipo);

module.exports = Router;

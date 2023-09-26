const express = require("express");
const Router = express.Router();
const ProyectoController = require("../controllers/ProyectoController");

Router.route("/")
  .get(ProyectoController.verProyectos)
  .post(ProyectoController.crearProyecto)
  .delete(ProyectoController.eliminarProyectos);

Router.route("/:id")
  .get(ProyectoController.verProyecto)
  .patch(ProyectoController.actualizarProyecto)
  .delete(ProyectoController.eliminarProyecto);

module.exports = Router;

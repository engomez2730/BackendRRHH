const express = require("express");
const Router = express.Router();
const solicitantesController = require("../controllers/solicitantesController");

Router.route("/")
  .get(solicitantesController.verSolicitantes)
  .delete(solicitantesController.borrarSolicitantes);

Router.route("/:id")
  .get(solicitantesController.verSolicitante)
  .post(
    solicitantesController.uploadUserPhoto,
    solicitantesController.createSolicitante
  )
  .patch(solicitantesController.editarSolicitante)
  .delete(solicitantesController.eliminarSolicitantes);

/* Router
.route('/nuevosolicitante/:id')
.patch(vacantesController.uploadUserPhoto, vacantesController.nuevoSolicitante) */
module.exports = Router;

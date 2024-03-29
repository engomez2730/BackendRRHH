const express = require("express");
const Router = express.Router();
const employeesController = require("../controllers/employees");
const despidosController = require("../controllers/despidosController");
const authController = require("../controllers/authController");

Router.route("/")
  .get(employeesController.verEmpleados)
  .post(authController.crearEmpleado)
  .delete(employeesController.eliminarEmpleados);

Router.route("/buscar").get(employeesController.verEmpleadosBuscar);
Router.route("/agregardimitidos").post(
  employeesController.agregarDimitido,
  despidosController.crearDespido
);

Router.route("/stats/").get(employeesController.getEmpleadosStats);
Router.route("/ausenciasStats/").get(employeesController.ausenciasStats);

Router.route("/despidos/:id").patch(employeesController.despedirEmpleado);

Router.route("/beneficios/:id").patch(employeesController.agregarBeneficio);

Router.route("/vacaciones/:id").patch(employeesController.vacaciones);

Router.route("/nomina/:id").patch(employeesController.nomina);

Router.route("/:id")
  .get(employeesController.verEmpleado)
  .patch(
    employeesController.uploadUserPhoto,
    employeesController.editarEmpleado
  )
  .delete(employeesController.eliminarEmpleado);

Router.route("/ausencias/:id").patch(employeesController.ponerAusencia);

module.exports = Router;

const express = require("express");
const app = express();
const AppError = require("./utils/appErrorClass");
const errorController = require("./controllers/errorController");
const path = require("path");

const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");

process.setMaxListeners(0);
const employeesRoute = require("./routes/employeesRote");
const departamentoRoute = require("./routes/departamentosRoutes.js");
const anunciosRoute = require("./routes/anunciosRoutes.js");
const entrevistados = require("./routes/entrevistadosRoute.js");
const vacantes = require("./routes/vacantesRoutes.js");
const solicitantes = require("./routes/solicitanteRoutes.js");
const despidos = require("./routes/despidosRoutes.js");
const permisos = require("./routes/permisosRoute.js");
const vacaciones = require("./routes/vacacionRoute");
const epp = require("./routes/eppRoutes");
const puestos = require("./routes/puestosRoutes");
const beneficiosRoute = require("./routes/beneficiosRoute");
const licenciasRoute = require("./routes/LicenciasRoutes");
const amonestacion = require("./routes/amonestacionesRouter");
const rootRoute = require("./routes/rootRoute");
const equipos = require("./routes/equiposRoute");
const proyectos = require("./routes/ProyectosRoute");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.post("/webhook-checkout", bodyParser.raw({ type: "application/json" }));

app.use("/api/v1/", rootRoute);
app.use("/api/v1/empleados", employeesRoute);
app.use("/api/v1/departamentos", departamentoRoute);
app.use("/api/v1/anuncios", anunciosRoute);
app.use("/api/v1/entrevistados", entrevistados);
app.use("/api/v1/vacantes", vacantes);
app.use("/api/v1/solicitantes", solicitantes);
app.use("/api/v1/permisos", permisos);
app.use("/api/v1/despidos", despidos);
app.use("/api/v1/vacaciones", vacaciones);
app.use("/api/v1/puestos", puestos);
app.use("/api/v1/epp", epp);
app.use("/api/v1/beneficios", beneficiosRoute);
app.use("/api/v1/licencias", licenciasRoute);
app.use("/api/v1/amonestaciones", amonestacion);
app.use("/api/v1/equipos", equipos);
app.use("/api/v1/proyectos", proyectos);

app.all("*", (req, res, next) => {
  return next(new AppError(`La ruta ${req.originalUrl} no existe ☹`, 404));
});

app.use(errorController);

module.exports = app;

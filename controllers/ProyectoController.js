const ProyectoModel = require("../models/ProyectosModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");

exports.crearProyecto = catchAsync(async (req, res) => {
  const newProyecto = await ProyectoModel.create(req.body);
  res.status(201).json({
    status: "Success",
    newProyecto,
  });
});

exports.verProyectos = catchAsync(async (req, res) => {
  const Proyectos = await ProyectoModel.find({});

  res.status(201).json({
    status: "Success",
    cantidadProyectos: Proyectos.length,
    Proyectos,
  });
});

exports.eliminarProyectos = catchAsync(async (req, res) => {
  await ProyectoModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});
exports.verProyecto = catchAsync(async (req, res, next) => {
  const Proyecto = await ProyectoModel.findById(req.params.id);
  if (!Proyecto) return next(new AppError("No hay Proyecto con este ID", 404));

  res.status(201).json({
    status: "Success",
    Equipo,
  });
});
exports.actualizarProyecto = factory.updateOne(ProyectoModel);
exports.eliminarProyecto = factory.deleteOne(ProyectoModel);

const equipoModel = require("../models/EquipoModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");

exports.crearEquipo = catchAsync(async (req, res) => {
  const newEquipo = await equipoModel.create(req.body);
  res.status(201).json({
    status: "Success",
    newEquipo,
  });
});

exports.verEquipos = catchAsync(async (req, res) => {
  const Equipos = await equipoModel.find({});

  res.status(201).json({
    status: "Success",
    cantidadEquipos: Equipos.length,
    Equipos,
  });
});

exports.eliminarEquipos = catchAsync(async (req, res) => {
  await equipoModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});
exports.verEquipo = catchAsync(async (req, res, next) => {
  const Equipo = await equipoModel.findById(req.params.id);
  if (!Equipo) return next(new AppError("No hay Equipo con este ID", 404));

  res.status(201).json({
    status: "Success",
    Equipo,
  });
});
exports.actualizarEquipo = factory.updateOne(equipoModel);
exports.eliminarEquipo = factory.deleteOne(equipoModel);

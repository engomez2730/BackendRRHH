const vacacionesModel = require("../models/vacacionesModel");
const empleadosModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrorClass");
const calcularVacaciones = require("../utils/calcularVacaciones");
const moment = require("moment");
const { relativeTimeRounding } = require("moment");

function addOneYear(dateStr) {
  const inputDate = moment(dateStr, "YYYY-MM-DD");
  const oneYearLater = inputDate.add(1, "year");
  return oneYearLater.format("YYYY-MM-DD");
}

exports.crearVacaciones = catchAsync(async (req, res, next) => {
  req.body.siguientesVacacionesFecha = addOneYear(
    req.body?.tiempoDeVacaciones[0]
  );

  const empleadoPrueba = await empleadosModel.findById(req.body.key);

  if (req.body.diasDeVacaciones === 0) {
    return next(new AppError("No tiene derechos a vacaciones", 403));
  }

  const diasDeVacaciones = calcularVacaciones.vacaciones(
    empleadoPrueba.inicioLaboral
  );

  if (diasDeVacaciones <= 0) {
    return next(new AppError("No tienes derecho a vacaciones aun"));
  }

  const newVacaciones = await vacacionesModel.create(req.body);

  await empleadosModel.updateOne(
    { _id: req.body.key },
    { $push: { Vacaciones: newVacaciones._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  await newVacaciones.updateOne(
    { _id: newVacaciones._id },
    { $push: { Empleados: req.body.key } },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Success",
    newVacaciones,
  });
});

exports.verVacaciones = catchAsync(async (req, res) => {
  const Vacaciones = await vacacionesModel.find({}).populate({
    path: "Empleados",
  });
  res.status(201).json({
    status: "Success",
    Vacaciones,
  });
});

exports.eliminarVacaciones = catchAsync(async (req, res) => {
  await vacacionesModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});
exports.verVacacion = catchAsync(async (req, res, next) => {
  const vacacion = await vacacionesModel.findById(req.params.id);
  if (!vacacion) return next(new AppError("No hay Vacaiones con este ID", 404));

  res.status(201).json({
    status: "Success",
    vacacion,
  });
});

exports.editarVacacion = catchAsync(async (req, res, next) => {
  const vacacion = await vacacionesModel.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (!vacacion)
    return next(new AppError("No hay Vacaciones con este ID", 404));

  res.status(201).json({
    status: "Success",
    vacacion,
  });
});
/* exports.actualizarAnuncio = factory.updateOne(anunciosModel) 
exports.eliminarAnuncio = factory.deleteOne(anunciosModel)  */

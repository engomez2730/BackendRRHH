const AmonestacionModel = require("../models/Amonestaciones");
const employeesModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");
const calcularNomina = require("../utils/calcularVacaciones");

exports.crearAmonestacion = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (!req.body.nombreAmonestacion || !req.body.cantidadAmonestacion) {
    return next(new AppError("Debes insertar la data"));
  }

  req.body.cantidadAmonestacion = req.body.cantidadAmonestacion * -1;

  const Amonestacion = await AmonestacionModel.create(req.body);
  await employeesModel.updateOne(
    { _id: req.body.key },
    { $push: { Amonestaciones: Amonestacion._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Success",
    Amonestacion,
  });
});

exports.verAmonestaciones = catchAsync(async (req, res) => {
  const Amonestacion = await AmonestacionModel.find({});

  res.status(201).json({
    status: "Success",
    Amonestacion,
  });
});

exports.verAmonestacion = catchAsync(async (req, res, next) => {
  const Amonestacion = await AmonestacionModel.findById(req.params.id);

  if (!Amonestacion)
    return next(new AppError("No existe Amonestacioncon este ID", 404));

  res.status(201).json({
    status: "Success",
    Amonestacion,
  });
});

exports.eliminarAmonestaciones = catchAsync(async (req, res) => {
  await AmonestacionModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});

exports.editarAmonestacion = catchAsync(async (req, res, next) => {
  const AmonestacionEditado = await AmonestacionModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Success",
    AmonestacionEditado,
  });
});

exports.eliminarAmonestacion = catchAsync(async (req, res, next) => {
  const amonestacionEliminado = await AmonestacionModel.findByIdAndDelete(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    amonestacionEliminado,
  });
});

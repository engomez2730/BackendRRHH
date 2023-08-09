const BeneficiosModel = require("../models/BenefModel");
const employeesModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");
const calcularNomina = require("../utils/calcularVacaciones");

exports.crearBeneficios = catchAsync(async (req, res, next) => {
  if (!req.body.nombreBeneficio || !req.body.cantidadBeneficio) {
    return next(new AppError("Debes insertar la data"));
  }

  const Beneficios = await BeneficiosModel.create(req.body);

  await employeesModel.updateOne(
    { _id: req.body.key },
    { $push: { Beneficios: Beneficios._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Success",
    Beneficios,
  });
});

exports.verBeneficios = catchAsync(async (req, res) => {
  const Beneficios = await BeneficiosModel.find({});

  res.status(201).json({
    status: "Success",
    Beneficios,
  });
});

exports.verBeneficio = catchAsync(async (req, res, next) => {
  const Beneficio = await BeneficiosModel.findById(req.params.id);

  if (!Beneficio)
    return next(new AppError("No existe beneficio con este ID", 404));

  res.status(201).json({
    status: "Success",
    Beneficio,
  });
});

exports.eliminarBeneficios = catchAsync(async (req, res) => {
  await BeneficiosModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});

exports.editarBeneficio = catchAsync(async (req, res, next) => {
  const beneficioEditado = await BeneficiosModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Success",
    beneficioEditado,
  });
});

exports.eliminarBeneficio = catchAsync(async (req, res, next) => {
  const beneficioEliminado = await BeneficiosModel.findByIdAndDelete(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    beneficioEliminado,
  });
});

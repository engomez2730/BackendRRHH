const catchAsync = require("../utils/catchAsync");
const licenciasModel = require("../models/licenciasModel");
const empleadosModel = require("../models/employeesModel");
const AppError = require("../utils/appErrorClass");

exports.crearLicencia = catchAsync(async (req, res) => {
  const newLicencia = await licenciasModel.create(req.body);

  if (req.body.historial) {
    await empleadosModel.updateOne(
      { _id: req.body.empleado },
      { $push: { historial: req.body.historial } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  await empleadosModel.updateOne(
    { _id: req.body.empleado },
    { $push: { Licencias: newLicencia._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  await empleadosModel.findByIdAndUpdate(req.body.empleado, {
    StatusLaboral: newLicencia.tipoDeLicencia,
    comentarioStatus: newLicencia.tiempoDeLicencia[1],
  });
  res.status(201).json({
    status: "Success",
    newLicencia,
  });
});

exports.verLicencias = catchAsync(async (req, res) => {
  const verLicencias = await licenciasModel.find({});

  res.status(201).json({
    status: "Success",
    verLicencias,
  });
});

exports.deleteLicencias = catchAsync(async (req, res) => {
  await licenciasModel.deleteMany();

  res.status(201).json({
    status: "Success",
  });
});

exports.verLicencia = catchAsync(async (req, res, next) => {
  const verLicencia = await licenciasModel.findById(req.params.id);
  if (!verLicencia)
    return next(new AppError("No existe documento con este ID", 404));

  res.status(201).json({
    status: "Success",
    verLicencia,
  });
});

exports.actualizarLicencia = catchAsync(async (req, res, next) => {
  const Licencia = await licenciasModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!Licencia)
    return next(new AppError("No existe documento con este ID", 404));

  res.status(201).json({
    status: "Success",
    Licencia,
  });
});

exports.eliminarEpp = catchAsync(async (req, res, next) => {
  const Licencia = await licenciasModel.findByIdAndDelete(req.params.id);

  if (!Licencia)
    return next(new AppError("No existe documento con este ID", 404));

  res.status(201).json({
    status: "Success",
  });
});

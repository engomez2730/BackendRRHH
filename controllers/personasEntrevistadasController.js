const EntrevistadosModel = require("../models/PersonasEntrevistadas");
const empleadosModel = require("../models/employeesModel");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");
const catchAsync = require("../utils/catchAsync");

exports.createEntrevistado = catchAsync(async (req, res, next) => {
  console.log(req.body.cedula);
  console.log("HOla");
  const empleado = await empleadosModel.findOne({ cedula: req.body.cedula });
  console.log(empleado);

  if (empleado)
    return next(new AppError("Ya existe un empleado con esa cedula", 409));

  const Entrevistados = await EntrevistadosModel.create(req.body);

  res.status(201).json({
    status: "Success",
    Entrevistados,
  });
});

exports.verEntrevistados = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];

  excludeFields.forEach((el) => delete queryObj[el]);
  const query = EntrevistadosModel.find(queryObj);
  const Entrevistados = await query;
  res.status(201).json({
    status: "Success",
    Entrevistados,
  });
});
exports.verEntrevistado = factory.getOne(EntrevistadosModel);
exports.editarEntrevistado = factory.updateOne(EntrevistadosModel);
exports.eliminarEntrevistado = factory.deleteOne(EntrevistadosModel);

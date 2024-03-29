const departamentoModel = require("../models/departamentosModel");
const employeesModel = require("../models/employeesModel");
const AppError = require("../utils/appErrorClass");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");

exports.editarDepartamento = catchAsync(async (req, res, next) => {
  const Departamento = await departamentoModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(Departamento);

  res.status(201).json({
    status: "Success",
    data: {
      Departamento,
    },
  });
});
exports.eliminarDepartamento = catchAsync(async (req, res, next) => {

  console.log('KLK')
  const Departamento = await departamentoModel.findByIdAndDelete(req.params.id);

  if (!Departamento)
    return next(new AppError("No hay departamento con este ID", 401));

  res.status(201).json({
    status: "Success",
    data: {
      Departamento,
    },
  });
});

exports.crearDepartamento = catchAsync(async (req, res, next) => {
  const departamentoBuscar = await departamentoModel.findOne({
    nombre: req.body.nombre,
  });

  if (departamentoBuscar) {
    return next(new AppError("Ya existe un departamento con este nombre"));
  }

  const Departamentos = await departamentoModel.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      Departamentos,
    },
  });
});

exports.verDepartamentos = catchAsync(async (req, res) => {
  const Departamentos = await departamentoModel.find().populate({
    path: "Empleados",
  });

  res.status(201).json({
    status: "Success",
    cantidadDeDepartamentos: Departamentos.length,
    data: {
      Departamentos,
    },
  });
});

exports.verDepartamentosEmpleados = catchAsync(async (req, res) => {
  const Departamentos = await employeesModel.find({
    $text: { $search: '"enderson"' },
  });

  res.status(201).json({
    status: "Success",
    cantidadDeDepartamentos: Departamentos.length,
    data: {
      Departamentos,
    },
  });
});

exports.eliminarDepartamentos = catchAsync(async (req, res) => {
  await departamentoModel.deleteMany();

  res.status(201).json({
    status: "Success",
  });
});

exports.verDepartamento = catchAsync(async (req, res, next) => {
  const Departamentos = await departamentoModel
    .findById(req.params.id)
    .populate({
      path: "Empleados",
      select: "-__v",
    });

  if (!Departamentos)
    return next(new AppError("No hay Departamento con este ID", 404));

  res.status(201).json({
    status: "Success",
    Departamentos,
  });
});

const despidosModel = require("../models/despidosModel");

const employeeModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrorClass");
const calcular = require("../utils/calcularVacaciones");

exports.crearDespido = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  console.log("HOla");
  const usuario = await employeeModel
    .findByIdAndUpdate(
      req.params.id,
      { estado: false },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("Vacaciones");

  const newDespido = await despidosModel.create({
    tipoDeDespido: req.body.tipo,
    descripcion: req.body.descripcion,
    prestacionesLaborables: req.body.prestacionesLaborables,
    Usuario: req.params.id,
  });

  await employeeModel.updateOne(
    { _id: usuario._id },
    { $push: { Despidos: newDespido._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Success",
    newDespido,
  });
});

exports.verDespidos = catchAsync(async (req, res) => {
  const Despidos = await despidosModel.find({}).populate({
    path: "Usuario",
    select: ["-Nominas", "-Vacaciones"],
  });
  res.status(201).json({
    status: "Success",
    cantidadAnuncios: Despidos.length,
    Despidos,
  });
});

exports.eliminarDespidos = catchAsync(async (req, res) => {
  await despidosModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});

exports.verDespido = catchAsync(async (req, res, next) => {
  const despido = await despidosModel.findById(req.params.id).populate({
    path: "Usuario",
  });
  if (!despido) return next(new AppError("No hay Despido con este ID", 404));
  res.status(201).json({
    status: "Success",
    despido,
  });
});

const despidosModel = require("../models/despidosModel");

const employeeModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrorClass");
const calcular = require("../utils/calcularVacaciones");

exports.crearDespido = catchAsync(async (req, res, next) => {
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

  /*   if (req.body.tipo === "Desahucio") {
    const regalia = calcular.regalia(usuario.createdAt, usuario.salarioBruto);
    prestaciones = calcular.calcularPrestaciones(
      usuario.createdAt,
      usuario.salarioBruto,
      false,
      sueldoDeVacaciones,
      regalia
    );
  } else if (req.body.tipo === "Renuncia") {
    const regalia = calcular.regalia(usuario.createdAt, usuario.salarioBruto);
    prestaciones = regalia + sueldoDeVacaciones;
  } else if (req.body.tipo === "Despido") {
    const regalia = calcular.regalia(usuario.createdAt, usuario.salarioBruto);
    prestaciones = regalia + sueldoDeVacaciones;
  } else if (req.body.tipo === "Dimision") {
    const regalia = calcular.regalia(usuario.createdAt, usuario.salarioBruto);
    prestaciones = calcular.calcularPrestaciones(
      usuario.createdAt,
      usuario.salarioBruto,
      false,
      sueldoDeVacaciones,
      regalia
    );
  } else if (req.body.tipo === "Muerte") {
    const sueldoDeudor = (usuario.salarioBruto / 30) * new Date().getDate();
    const meses = calculateMonths(new Date(), new Date(usuario.createdAt));
    let AsistenciaEconomica;
    if (meses >= 3) {
      AsistenciaEconomica = (usuario.salarioBruto * 30) / 5;
    }
    if (meses >= 6) {
      AsistenciaEconomica = (usuario.salarioBruto * 30) / 10;
    }
    if (meses > 12) {
      AsistenciaEconomica = (usuario.salarioBruto * 30) / 15;
    }
    prestaciones = AsistenciaEconomica + sueldoDeudor + sueldoDeVacaciones;
  } */

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

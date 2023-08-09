const nominaModel = require("../models/nominaModel");
const employeesModel = require("../models/employeesModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");
const calcularNomina = require("../utils/calcularVacaciones");
const nominaCompleta = require("../models/nominaCompleta");

exports.crearNomina = catchAsync(async (req, res, next) => {

  const empleado = await employeesModel
    .findById(req.body.Empleados)
    .populate({
      path: "Nominas",
    })
    .populate({
      path: "Vacaciones",
    });

  empleado.Nominas?.forEach((e) => {
    if (e.nombreNomina === req.body.nombreNomina) {
      return next(new AppError("Ya existe una nomina con este mes", 401));
    }
  });

  if (empleado.Vacaciones.length >= 0) {
    var mes = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const mesVacaciones = new Date(
      empleado?.Vacaciones[
        empleado.Vacaciones.length - 1
      ]?.tiempoDeVacaciones[0]
    ).getMonth();
    const yearVacaciones = new Date(
      empleado?.Vacaciones[
        empleado.Vacaciones.length - 1
      ]?.tiempoDeVacaciones[0]
    ).getFullYear();
    const mesNomina = req.body.nombreNomina?.split(" ")[0];
    const yearNomina = Number(req.body.nombreNomina.split(" ")[1]);

    if (mesNomina === mes[mesVacaciones] && yearVacaciones === yearNomina) {
      req.body.salarioPorVacaciones =
        empleado.Vacaciones[
          empleado.Vacaciones.length - 1
        ].salarioPorVacaciones;
    }
  }

  if (req.body.nombreNomina.split(" ")[0] === "Diciembre") {
    req.body.regalia = calcularNomina.regalia(
      empleado.createdAt,
      empleado.salarioBruto
    );
  }

  let calculos;
  if (req.body.tipoDeNomina === "Nomina Fija") {
    calculos = calcularNomina.nomina(
      req.body.salarioBruto,
      0,
      req.body.tipoDeNomina,
      req.body.salarioPorVacaciones,
      req.body.regalia
    );
  } else {
    let horasTrabajadas =
      req.body.horasMensualesTrabajadas * req.body.costoPorHora;
    let horasExtrasTotal =
      req.body.horasExtras *
        (req.body.costoPorHora * 0.35 + req.body.costoPorHora) || 0;
    let horasDoblesTotal =
      req.body.horasDobles * (req.body.costoPorHora * 2) || 0;
    const totalSalario =
      horasTrabajadas + horasExtrasTotal + horasDoblesTotal || 0;

    calculos = calcularNomina.nomina(
      req.body.salarioBruto,
      totalSalario,
      req.body.tipoDeNomina,
      req.body.salarioPorVacaciones,
      req.body.regalia
    );

  }

  const calculosFinal = {
    ...calculos,
    Empleados: req.body.Empleados,
    tipoDeNomina: req.body.tipoDeNomina,
    costoPorHora: req.body.costoPorHora,
    horasMensualesTrabajadas: req.body.horasMensualesTrabajadas,
    nombreNomina: req.body.nombreNomina,
    horasExtras: req.body.horasExtras,
    horasDobles: req.body.horasDobles,
    descuentos: req.body.descuentos,
    bonus: req.body.bonus,
    salarioPorVacaciones: req.body.salarioPorVacaciones,
    regalia: req.body.regalia,
    prestacionesLaborables: req.body.prestacionesLaborables,
  };

  const newNomina = await nominaModel.create(calculosFinal);
  await nominaCompleta.updateOne(
    { nombreNomina: req.body.nombreNomina },
    { $push: { Nominas: newNomina._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  await employeesModel.updateOne(
    { _id: req.body.Empleados },
    { $push: { Nominas: newNomina._id } },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Success",
    newNomina,
  });
});

exports.verNominas = catchAsync(async (req, res) => {
  const newNomina = await nominaModel.find().populate({
    path: "Empleados",
  });
  res.status(201).json({
    status: "Success",
    newNomina,
  });
});

exports.verNomina = catchAsync(async (req, res, next) => {
  const newNomina = await nominaModel.findById(req.params.id).populate({
    path: "Empleados",
  });

  if (!newNomina) {
    return next(new AppError("No existe Nomina con este ID"));
  }
  res.status(201).json({
    status: "Success",
    newNomina,
  });
});

exports.editarNomina = catchAsync(async (req, res, next) => {
  const newNomina = await nominaModel.findByIdAndUpdate(req.params.id, {});
  if (!newNomina) {
    return next(new AppError("No existe Nomina con este ID"));
  }
  res.status(201).json({
    status: "Success",
    newNomina,
  });
});

exports.eliminarNominas = catchAsync(async (req, res) => {
  await nominaModel.deleteMany();

  res.status(201).json({
    status: "Success",
  });
});

exports.getNominaStats = catchAsync(async (req, res, next) => {
  console.log(req.query.query);

  const stats = await nominaModel.aggregate([
    {
      $match: { year: Number(req.params.year) },
    },
    {
      $group: {
        _id: { $toUpper: `$${req.query.query || "mes"}` },
        numTours: { $sum: 1 },
        avgSalario: { $avg: "$sueldoNeto" },
        salarioMenor: { $min: "$sueldoNeto" },
        salarioMayor: { $max: "$sueldoNeto" },
        totalNomina: { $sum: "$sueldoNeto" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});

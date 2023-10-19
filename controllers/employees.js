const employeeModel = require("../models/employeesModel");
const AppError = require("../utils/appErrorClass");
const catchAsync = require("../utils/catchAsync");
const departamentoModel = require("../models/departamentosModel");
const despidosModel = require("../models/despidosModel");
const BenefModel = require("../models/BenefModel");
const factory = require("../utils/factory");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/photos");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype?.split("/")[1] || "jpg";
    cb(null, `${"req.user.id"}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.verEmpleadosBuscar = catchAsync(async (req, res) => {
  const Empleados = await employeeModel
    .find({
      nombre: {
        $regex: `${req.query.query}`,
        $options: "i", // Case-insensitive search
      },
    })
    .populate({
      path: "Vacaciones",
    })
    .populate({
      path: "Epps",
    })
    .populate({
      path: "Despidos",
    })
    .populate({
      path: "Licencias",
    })
    .populate({
      path: "Beneficios",
    })
    .populate({
      path: "Amonestaciones",
    })
    .populate({
      path: "Permisos",
    })
    .populate({
      path: "Despidos",
    });

  res.status(201).json({
    status: "Success",
    empleados: {
      Empleados,
    },
  });
});

exports.verEmpleados = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  const query = employeeModel
    .find(queryObj)
    .populate({
      path: "Vacaciones",
    })
    .populate({
      path: "Epps",
    })
    .populate({
      path: "Despidos",
    })
    .populate({
      path: "Licencias",
    })
    .populate({
      path: "Beneficios",
    })
    .populate({
      path: "Amonestaciones",
    })
    .populate({
      path: "Permisos",
    })
    .populate({
      path: "Despidos",
    });
  const Empleados = await query;
  const empleadosTotales = await employeeModel.find({});
  const empleadosInactivos = await employeeModel.find({ estado: false });

  res.status(201).json({
    status: "Success",
    empleados: {
      Empleados,
      EmpleadosTotales: empleadosTotales.length,
      EmpleadosInactivos: empleadosInactivos.length,
    },
  });
});

exports.eliminarEmpleados = catchAsync(async (req, res) => {
  await employeeModel.deleteMany({ rol: { $ne: "admin" } });
  res.status(201).json({
    status: "Success",
  });
});

exports.verEmpleado = catchAsync(async (req, res, next) => {
  const doc = await employeeModel
    .findById(req.params.id)
    .populate({
      path: "Vacaciones",
    })
    .populate({
      path: "Epps",
    })
    .populate({
      path: "Licencias",
    })
    .populate({
      path: "Beneficios",
    })
    .populate({
      path: "Amonestaciones",
    })
    .populate({
      path: "Permisos",
    })
    .populate({
      path: "Despidos",
    });

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.editarEmpleado = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let filterOBject = { ...req.body };
  if (req.file) {
    filterOBject.photo = req.file.filename;
  }

  if (req.body.departamento) {
    const departamentoEscogido = await departamentoModel.findOne({
      nombre: req.body.departamento,
    });
    if (!departamentoEscogido)
      return next(new AppError("No existe departamento con este nombre", 401));
    const usuario = await employeeModel.findById(req.params.id);
    const departamentoChange = await departamentoModel.findOne({
      nombre: usuario.departamento,
    });

    await departamentoModel.updateOne(
      { _id: departamentoChange._id },
      { $pull: { Empleados: usuario._id } },
      {
        new: true,
        runValidators: true,
      }
    );

    await departamentoModel.updateOne(
      { _id: departamentoEscogido._id },
      { $push: { Empleados: usuario._id } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  const doc = await employeeModel.findByIdAndUpdate(
    req.params.id,
    filterOBject,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError("No se encontro ID con este Usuario", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.eliminarEmpleado = catchAsync(async (req, res, next) => {
  const empleadoEliminado = await employeeModel.findByIdAndUpdate(
    req.params.id,
    { estado: false }
  );

  res.status(200).json({
    status: "success",
    empleadoEliminado,
  });
});

exports.agregarDimitido = catchAsync(async (req, res, next) => {
  const empleado = await employeeModel.create({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    celular: req.body.celular,
    cedula: req.body.cedula,
    inicioLaboral: req.body.inicioLaboral,
    puesto: req.body.puesto,
    salarioBruto: req.body.salarioBruto,
  });
  req.params.id = empleado._id;

  next();
});

exports.ponerAusencia = catchAsync(async (req, res, next) => {
  await employeeModel.updateOne(
    { _id: req.params.id },
    { $push: { Ausencias: req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
  });
});

exports.agregarBeneficio = catchAsync(async (req, res, next) => {
  req.body.Beneficios.forEach(async (e) => {
    await employeeModel.updateOne(
      { _id: req.params.id },
      { $push: { Beneficios: e } },
      {
        new: true,
        runValidators: true,
      }
    );
  });
  res.status(200).json({
    status: "success",
  });
});

exports.vacaciones = catchAsync(async (req, res, next) => {
  const empleadoEditarVacaciones = await employeeModel.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(201).json({
    status: "Success",
    empleadoEditarVacaciones,
  });
});

exports.nomina = catchAsync(async (req, res, next) => {
  const empleadoEditarVacaciones = await employeeModel.findById(req.params.id);
  empleadoEditarVacaciones.salarioBruto = req.body.salarioBruto;
  empleadoEditarVacaciones.save({ validateBeforeSave: false });

  /*   const empleadoEditarNomina = await employeeModel.save({_id:req.params.id,salarioBruto:req.body.salarioBruto})
   */ res.status(201).json({
    status: "Success",
    /*     empleadoEditarNomina
     */
  });
});

exports.despedirEmpleado = catchAsync(async (req, res) => {
  const usuario = await employeeModel.findByIdAndUpdate(req.params.id, {
    estado: false,
  });
  const despido = await despidosModel.create(req.body);
  await despidosModel.updateOne(
    { _id: despido._id },
    { $push: { Usuario: usuario._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Success",
    despido,
  });
});

exports.getEmpleadosStats = catchAsync(async (req, res, next) => {
  const stats = await employeeModel.aggregate([
    {
      $facet: {
        totalEmployees: [{ $group: { _id: null, total: { $sum: 1 } } }],
        employeesByCountry: [
          {
            $group: {
              _id: "$pais", // Grouping by country
              totalEmployees: { $sum: 1 },
              activeEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", true] }, 1, 0] },
              },
              inactiveEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", false] }, 1, 0] },
              },
              averageSalary: { $avg: "$salarioBruto" },
              totalVacations: { $sum: { $size: "$Vacaciones" } },
            },
          },
        ],
        employeesByDepartment: [
          {
            $group: {
              _id: "$departamento", // Grouping by department
              totalEmployees: { $sum: 1 },
              activeEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", true] }, 1, 0] },
              },
              inactiveEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", false] }, 1, 0] },
              },
              averageSalary: { $avg: "$salarioBruto" },
              totalVacations: { $sum: { $size: "$Vacaciones" } },
            },
          },
        ],
        employeesByNominaType: [
          {
            $group: {
              _id: "$tipoDeNomina", // Grouping by tipoDeNomina
              totalEmployees: { $sum: 1 },
              activeEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", true] }, 1, 0] },
              },
              inactiveEmployees: {
                $sum: { $cond: [{ $eq: ["$estado", false] }, 1, 0] },
              },
              averageSalary: { $avg: "$salarioBruto" },
              totalVacations: { $sum: { $size: "$Vacaciones" } },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalEmployees: { $arrayElemAt: ["$totalEmployees.total", 0] },
        employeesByCountry: 1,
        employeesByDepartment: 1,
        employeesByNominaType: 1,
      },
    },
    {
      $project: {
        totalEmployees: 1,
        employeesByCountry: 1,
        employeesByDepartment: 1,
        employeesByNominaType: 1,
        totalActiveEmployees: { $sum: "$employeesByCountry.activeEmployees" },
        totalInactiveEmployees: {
          $sum: "$employeesByCountry.inactiveEmployees",
        },
      },
    },
  ]);

  const statsFinal = stats[0];

  res.status(200).json({
    status: "success",
    statsFinal,
  });
});

exports.ausenciasStats = catchAsync(async (req, res) => {
  const pipeline = [
    {
      $unwind: "$Ausencias",
    },
    {
      $match: {
        "Ausencias.fecha": {
          $gte: new Date(req.query.year, 0, 1), // Start of the year
          $lt: new Date(Number(req.query.year) + 1, 0, 1), // Start of the next year
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$Ausencias.fecha" },
          year: { $year: "$Ausencias.fecha" },
        },
        ausencias: {
          $push: {
            fecha: "$Ausencias.fecha",
            razon: "$Ausencias.razon",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        ausencias: 1,
      },
    },
  ];

  const result = await employeeModel.aggregate(pipeline);

  // Replace 'totalEmployees' with the actual total number of employees.
  // You can get this count with another Mongoose query.

  res.status(200).json({
    status: "success",
    result,
  });
});

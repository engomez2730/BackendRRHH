const EntrevistadosModel = require("../models/PersonasEntrevistadas");
const empleadosModel = require("../models/employeesModel");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");
const catchAsync = require("../utils/catchAsync");
const VacantesModel = require("../models/vacantesModel");
const path = require("path");

const multer = require("multer");
const vacantesModel = require("../models/vacantesModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/doc"); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage });

exports.subirDocumento = upload.single("document");

exports.createEntrevistado = catchAsync(async (req, res, next) => {
  const empleado = await empleadosModel.findOne({ cedula: req.body.cedula });

  if (empleado)
    return next(new AppError("Ya existe un empleado con esa cedula", 409));

  const Entrevistados = await EntrevistadosModel.create(req.body);

  await vacantesModel.updateOne(
    { nombre: req.body.vacanteAplicada },
    { $pull: { Solicitantes: Entrevistados._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "Success",
    Entrevistados,
  });
});

exports.verEntrevistados = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];

  excludeFields.forEach((el) => delete queryObj[el]);
  const query = await EntrevistadosModel.find(queryObj);
  const Entrevistados = await query;
  res.status(201).json({
    status: "Success",
    Entrevistados,
  });
});

exports.editarEntrevistado = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.document = req.file.filename;
  }

  const candidatoEntrevistado = await EntrevistadosModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Success",
    candidatoEntrevistado,
  });
});

exports.verEntrevistado = factory.getOne(EntrevistadosModel);
exports.eliminarEntrevistado = factory.deleteOne(EntrevistadosModel);

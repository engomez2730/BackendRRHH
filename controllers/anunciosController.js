const anunciosModel = require("../models/anunciosModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factory");
const AppError = require("../utils/appErrorClass");

exports.crearAnuncio = catchAsync(async (req, res) => {
  const newAnuncio = await anunciosModel.create(req.body);
  res.status(201).json({
    status: "Success",
    newAnuncio,
  });
});

exports.verAnuncios = catchAsync(async (req, res) => {
  const Anuncios = await anunciosModel.find({});
  /* Anuncios.forEach(e =>{
        if(e.finishAt < Date.now()){
            e.estado = false
        }
    })  */
  res.status(201).json({
    status: "Success",
    cantidadAnuncios: Anuncios.length,
    Anuncios,
  });
});

exports.eliminarAnuncios = catchAsync(async (req, res) => {
  await anunciosModel.deleteMany();
  res.status(201).json({
    status: "Success",
  });
});
exports.verAnuncio = catchAsync(async (req, res, next) => {
  const anuncio = await anunciosModel.findById(req.params.id);
  console.log(anuncio);
  if (!anuncio) return next(new AppError("No hay anuncio con este ID", 404));

  res.status(201).json({
    status: "Success",
    anuncio,
  });
});
exports.actualizarAnuncio = factory.updateOne(anunciosModel);
exports.eliminarAnuncio = factory.deleteOne(anunciosModel);

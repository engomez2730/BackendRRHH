const anunciosModel = require('../models/anunciosModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')

exports.crearAnuncio = catchAsync(async (req,res) =>{
    const newAnuncio = await anunciosModel.create(req.body)
    res.status(201).json({
        status:'Success',
        newAnuncio
    })
})

exports.verAnuncios = catchAsync(async (req,res) =>{
    const Anuncios = await anunciosModel.find({})
    Anuncios.forEach(e =>{
        if(e.finishAt < Date.now()){
            e.estado = false
        }
    }) 
    res.status(201).json({
        status:'Success',
        cantidadAnuncios:Anuncios.length,
        Anuncios
    })
})

exports.eliminarAnuncios = catchAsync(async (req,res) =>{
    await anunciosModel.deleteMany()
    res.status(201).json({
        status:'Success',
    })
})
exports.verAnuncio = factory.getOne(anunciosModel) 
exports.actualizarAnuncio = factory.updateOne(anunciosModel) 
exports.eliminarAnuncio = factory.deleteOne(anunciosModel) 


const anunciosModel = require('../models/anunciosModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')

exports.crearAnuncio = catchAsync(async (req,res) =>{

    const newAnuncio = await anunciosModel.create(req.body)
  
    res.status(201).json({
        status:'Success',
        newAnuncio
    })
})

exports.verAnuncios = catchAsync(async (req,res) =>{

    const Anuncios = await anunciosModel.find({})
  
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


exports.verAnuncio = catchAsync(async (req,res,next) =>{

    const anuncio = await anunciosModel.findById(req.params.id)
    
    if(!anuncio) next(new AppError('No existe usuario con este ID',404))

    res.status(201).json({
        status:'Success',
        anuncio
    })
})

exports.actualizarAnuncio = catchAsync(async (req,res,next) =>{

    const anuncio = await anunciosModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true, 
        runValidators:true
    })

    if(!anuncio) next(new AppError('No existe usuario con este ID',404))
  
    res.status(201).json({
        status:'Success',
        anuncio
    })
})

exports.eliminarAnuncio = catchAsync(async (req,res,next) =>{

    const anuncio = await anunciosModel.findByIdAndDelete(req.params.id)

    if(!anuncio) next(new AppError('No existe usuario con este ID',404))
  
    res.status(201).json({
        status:'Success',
    })
})
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const eppModel = require('../models/eppModel')
const empleadosModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')


exports.crearEpp = catchAsync(async (req,res) =>{
    console.log(req.body)
    const newEpp = await eppModel.create(req.body)
    await empleadosModel.updateOne({_id:req.body.Usuario},{$push:{Epps:newEpp._id}},{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        status:'Success',
        newEpp
    })
})

exports.verEpps= catchAsync(async (req,res) =>{
    const verEpps = await eppModel.find({}).populate('Usuario')

    res.status(201).json({
        status:'Success',
        verEpps
    })
})

exports.deleteEpps= catchAsync(async (req,res) =>{
 await eppModel.deleteMany()

    res.status(201).json({
        status:'Success'
    })
})

exports.verEpp = catchAsync(async (req,res,next) =>{
    const Epp = await eppModel.findById(req.params.id).populate('Empleados')
    if(!Epp) return next(new AppError('No existe documento con este ID',404))


    res.status(201).json({
        status:'Success',
        Epp
    })
})

exports.actualizarEpp = catchAsync(async (req,res,next) =>{
    const epp = await eppModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    if(!epp) return next(new AppError('No existe documento con este ID',404))


    res.status(201).json({
        status:'Success',
        epp
    })
})

exports.eliminarEpp = catchAsync(async (req,res,next) =>{

    const epp = await eppModel.findByIdAndDelete(req.params.id)

    if(!epp) return next(new AppError('No existe documento con este ID',404))

    res.status(201).json({
        status:'Success'
    })
})



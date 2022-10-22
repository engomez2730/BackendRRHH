const departamentoModel = require('../models/departamentosModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')


exports.editarDepartamento = factory.updateOne(departamentoModel)
exports.eliminarDepartamento = factory.deleteOne(departamentoModel)

exports.crearDepartamento = catchAsync(async (req,res) =>{
    const Departamentos = await departamentoModel.create(req.body)
    res.status(201).json({
        status:'Success',
        data:{
            Departamentos
        }
    })
})

exports.verDepartamentos = catchAsync(async (req,res) =>{
    const Departamentos = await departamentoModel.find().populate({
        path:'Empleados'
    })
   
    res.status(201).json({
        status:'Success',
        cantidadDeDepartamentos:Departamentos.length,
        data:{
            Departamentos
        }
    })
})

exports.eliminarDepartamentos = catchAsync(async (req,res) =>{
    await departamentoModel.deleteMany()
   
    res.status(201).json({
        status:'Success',
    })
})


exports.verDepartamento = catchAsync(async (req,res) =>{
    const Departamentos = await departamentoModel.findById(req.params.id).populate({
        path:'Empleados',
        select:'-__v'
    })
   
    res.status(201).json({
        status:'Success',
        Departamentos
    })
})


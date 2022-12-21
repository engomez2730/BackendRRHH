const puestoModel = require('../models/puestosModel')
const employeesModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')


exports.editarPuesto = factory.updateOne(puestoModel)
exports.eliminarPuesto = factory.deleteOne(puestoModel)

exports.crearPuesto = catchAsync(async (req,res) =>{
    const Puestos = await puestoModel.create(req.body)
    res.status(201).json({
        status:'Success',
        data:{
            Puestos
        }
    })
})

exports.verPuestos = catchAsync(async (req,res) =>{
    const puestos = await puestoModel.find()/* .populate({
        path:'Empleados'
    })
    */
    res.status(201).json({
        status:'Success',
        cantidadDePuestos:puestos.length,
        data:{
            puestos
        }
    })
})


exports.eliminarPuestos= catchAsync(async (req,res) =>{
    await puestoModel.deleteMany()
   
    res.status(201).json({
        status:'Success',
    })
})


exports.verPuesto = catchAsync(async (req,res,next) =>{
    const Puesto = await puestoModel.findById(req.params.id)

    if(!Puesto) return next(new AppError('No hay Puestos con este ID',404))
   
    res.status(201).json({
        status:'Success',
        Puesto
    })
})


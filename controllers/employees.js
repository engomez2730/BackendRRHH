const employeeModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')

exports.verEmpleados = catchAsync( async (req,res) =>{
    const newEmpleado = await employeeModel.find({})
    res.status(201).json({
        status:'Success',
        empleados:{
            newEmpleado
        }
    })
})

exports.crearEmpleado = catchAsync(async (req,res) =>{
    const newEmpleado = await employeeModel.create(req.body)
    res.status(201).json({
        status:'Success',
        newEmpleado
    })
})

exports.eliminarEmpleados = catchAsync(async (req,res) =>{
    await employeeModel.deleteMany(req.body)
    res.status(201).json({
        status:'Success',
    })
})

exports.verEmpleado = catchAsync(async (req,res,next) =>{
    console.log(req.user)
    const empleado = await employeeModel.findById(req.params.id)
    if(!empleado){
        return next(new AppError('Este usuario no existe en este servidor',404))
    }
    res.status(201).json({
        status:'Success',
        empleado
    })
})

exports.editarEmpleado = catchAsync(async (req,res,next) =>{
    const empleado = await employeeModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    
    if(!empleado){
        return next(new AppError('Este usuario no existe en este servidor',404))
    }
    res.status(201).json({
        status:'Success',
        empleado
    })
})
exports.eliminarEmpleado = catchAsync(async (req,res,next) =>{
    await employeeModel.findByIdAndDelete(req.params.id)
    res.status(201).json({
        status:'Success'
    })
})

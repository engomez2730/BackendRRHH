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
    const empleadoLiquidado = await employeeModel.findById(req.params.id)
    empleadoLiquidado.estado = false

    res.status(201).json({
        status:'Success',
        prestacionesLaborables:empleadoLiquidado.PrestacionesLaborales,
        tiempoEnlaEmpresa:empleadoLiquidado.tiempoEnLaEmpresa
    })
})

exports.ponerAusencia = catchAsync(async (req,res,next) =>{
    const empleadoAusenciaUpdateds = await employeeModel.findById(req.params.id)

    if(!empleadoAusenciaUpdateds) next(new AppError('No existe empleado con este ID'))

    empleadoAusenciaUpdateds.ausencias = empleadoAusenciaUpdateds.ausencias + 1
    await empleadoAusenciaUpdateds.save()


    res.status(201).json({
        status:'Success',
        empleadoAusenciaUpdateds
    })
})


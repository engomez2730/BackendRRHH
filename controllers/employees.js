const employeeModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')

exports.verEmpleados = catchAsync( async (req,res) =>{
    const newEmpleado = await employeeModel.find({})
    res.status(201).json({
        status:'Success',
        empleados:{
            newEmpleado
        }
    })
})

exports.eliminarEmpleados = catchAsync(async (req,res) =>{
    await employeeModel.deleteMany(req.body)
    res.status(201).json({
        status:'Success',
    })
})

exports.verEmpleado = factory.getOne(employeeModel)
exports.editarEmpleado = factory.updateOne(employeeModel)
exports.eliminarEmpleado = factory.deleteOne(employeeModel)

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


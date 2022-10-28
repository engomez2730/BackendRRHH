const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const permisosModel = require('../models/permisosModel')
const empleadosModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')


exports.crearPermiso = catchAsync(async (req,res) =>{
    console.log(req.body)
    const newPermiso = await permisosModel.create(req.body)

    await permisosModel.updateOne({_id:newPermiso._id},{$push:{Empleados:req.body.empleado}},{
        new:true,
        runValidators:true
    })
    
    res.status(201).json({
        status:'Success',
        newPermiso
    })
})

exports.verPermisos = catchAsync(async (req,res) =>{
    const allPermisos = await permisosModel.find({}).populate('Empleados')

    res.status(201).json({
        status:'Success',
        allPermisos
    })
})

exports.verPermisosEmpleados = catchAsync(async (req,res,next) =>{
    const empleados = await empleadosModel.find(req.query)

    if(empleados.length === 0){
        return next(new AppError('No hay empleados con esa cedula',404))
    }

    res.status(201).json({
        status:'Success',
        empleados
    })
})

exports.deletePermisos = catchAsync(async (req,res) =>{
 await permisosModel.deleteMany()

    res.status(201).json({
        status:'Success'
    })
})

exports.verPermiso = catchAsync(async (req,res,next) =>{
    const permiso = await permisosModel.findById(req.params.id).populate('Empleados')
    if(!permiso) return next(new AppError('No existe documento con este ID',404))


    res.status(201).json({
        status:'Success',
        permiso
    })
})

exports.actualizarPermiso = catchAsync(async (req,res,next) =>{
    const permiso = await permisosModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    if(!permiso) return next(new AppError('No existe documento con este ID',404))


    res.status(201).json({
        status:'Success',
        permiso
    })
})

exports.eliminarPermiso = catchAsync(async (req,res,next) =>{

    const permiso = await permisosModel.findByIdAndDelete(req.params.id)

    if(!permiso) return next(new AppError('No existe documento con este ID',404))

    res.status(201).json({
        status:'Success'
    })
})



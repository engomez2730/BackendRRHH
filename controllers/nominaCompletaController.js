const nominaCompletaModel = require('../models/nominaCompleta')
const employeesModel = require('../models/employeesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const calcularNomina = require('../utils/calcularVacaciones')


exports.crearNominaCompleta = catchAsync(async (req,res) =>{

    const empleados = await employeesModel.find()
    const empleadosActivos = empleados.filter((e) =>{
        return e.estado === true
    })

    req.body = {...req.body,totalEmpleados:empleadosActivos.length}
    const newNominaCompleta = await nominaCompletaModel.create(req.body)


    res.status(201).json({
        status:'Success',
        newNominaCompleta
    })
})

exports.verNomincaCompleta = catchAsync(async (req,res) =>{

    const newNominaCompleta = await nominaCompletaModel.find()
    res.status(201).json({
        status:'Success',
        newNominaCompleta
    })
})

exports.verNominaCompletaOne = catchAsync(async (req,res) =>{

    const newNominaCompleta = await nominaCompletaModel.findById(req.params.id)
    
    res.status(201).json({
        status:'Success',
        newNominaCompleta
    })
})

exports.eliminarNominaCompleta = catchAsync(async (req,res) =>{
    
    await nominaCompletaModel.deleteMany()
    res.status(201).json({
        status:'Success',
       
    })
})
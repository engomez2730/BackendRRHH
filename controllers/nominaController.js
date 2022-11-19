const nominaModel = require('../models/nominaModel')
const employeesModel = require('../models/employeesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const calcularNomina = require('../utils/calcularVacaciones')


exports.crearNomina = catchAsync(async (req,res) =>{

    const calculos = calcularNomina.nomina(req.body.salarioBruto)
    const calculosFinal = {...calculos,Empleados:req.body.Empleados}
    const newNomina = await nominaModel.create(calculosFinal)
    await employeesModel.updateOne({_id:req.body.Empleados},{$push:{Nominas:newNomina._id}},{
        new:true,
        runValidators:true
    })
    res.status(201).json({
        status:'Success',
        newNomina
    })
})

exports.verNominas = catchAsync(async (req,res) =>{

    const newNomina = await nominaModel.find().populate({
        path:'Empleados'
    })
    res.status(201).json({
        status:'Success',  
        newNomina 
     })
})

exports.eliminarNominas = catchAsync(async (req,res) =>{
    await nominaModel.deleteMany()

    res.status(201).json({
        status:'Success',   
     })
})
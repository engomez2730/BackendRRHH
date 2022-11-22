const nominaModel = require('../models/nominaModel')
const employeesModel = require('../models/employeesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const calcularNomina = require('../utils/calcularVacaciones')


exports.crearNomina = catchAsync(async (req,res) =>{


    const calculos = calcularNomina.nomina(req.body.sueldoBruto)
    const calculosFinal = {...calculos,Empleados:req.body.Empleados,tipoDeNomina:req.body.tipoDeNomina,costoPorHora:req.body.costoPorHora,horasMensualesTrabajadas:req.body.horasMensualesTrabajadas}
    console.log(calculosFinal)
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

exports.verNomina = catchAsync(async (req,res,next) =>{

    const newNomina = await nominaModel.findById(req.params.id).populate({
        path:'Empleados'
    })

    if(!newNomina){
        return next(new AppError('No existe Nomina con este ID'))
    }

    res.status(201).json({
        status:'Success',  
        newNomina 
     })
})

exports.editarNomina = catchAsync(async (req,res,next) =>{

    console.log(req.body)

    const newNomina = await nominaModel.findByIdAndUpdate(req.params.id,{

    })

    if(!newNomina){
        return next(new AppError('No existe Nomina con este ID'))
    }

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
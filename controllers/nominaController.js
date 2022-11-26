const nominaModel = require('../models/nominaModel')
const employeesModel = require('../models/employeesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const calcularNomina = require('../utils/calcularVacaciones')
const nominaCompleta = require('../models/nominaCompleta')


exports.crearNomina = catchAsync(async (req,res) =>{

    let calculos;

    if(req.body.tipoDeNomina === 'Nomina Fija'){
        calculos = calcularNomina.nomina(req.body.sueldoBruto)
    }else{
        let horasTrabajadas = req.body.horasMensualesTrabajadas * req.body.costoPorHora
        let horasExtrasTotal = req.body.horasExtras * ((req.body.costoPorHora * 0.35) + req.body.costoPorHora)
        let horasDoblesTotal = req.body.horasDobles * (req.body.costoPorHora * 2)
        const totalSalario = horasTrabajadas + horasExtrasTotal + horasDoblesTotal || 0
        console.log(totalSalario)
        
       calculos = calcularNomina.nomina(req.body.sueldoBruto,totalSalario,req.body.tipoDeNomina)
    }
   
    const calculosFinal = {...calculos,
        Empleados:req.body.Empleados,
        tipoDeNomina:req.body.tipoDeNomina,
        costoPorHora:req.body.costoPorHora,
        horasMensualesTrabajadas:req.body.horasMensualesTrabajadas,
        nombreNomina:req.body.nombreNomina,
        horasExtras:req.body.horasExtras,
        horasDobles:req.body.horasDobles,
        descuentos:req.body.descuentos,
        bonus:req.body.bonus,
    }
    const newNomina = await nominaModel.create(calculosFinal)
    
    await nominaCompleta.updateOne({nombre:departamentoEscogido._id},{$push:{Empleados:newEmpleado._id}},{
        new:true,
        runValidators:true
      })


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

    const newNomina = await nominaModel.findByIdAndUpdate(req.params.id,{})
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
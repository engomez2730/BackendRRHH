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

    const newNominaCompleta = await nominaCompletaModel.find().populate({
        path:'Nominas'
    })
    res.status(201).json({
        status:'Success',
        newNominaCompleta
    })
})

exports.verNominaCompletaOne = catchAsync(async (req,res,next) =>{

    const newNominaCompleta = await nominaCompletaModel.findById(req.params.id).populate({
        path:'Nominas'
    }).populate({
        path:'Empleados'
    })

    if(!newNominaCompleta) return next(new AppError('No existe NominaCompleta con este ID',404))
    
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

exports.actualizarNomincaCompleta = catchAsync(async (req,res,next) =>{

   const verNominaCompleta = await nominaCompletaModel.findById(req.params.id)
   if(req.body.estado === 'Completa' || req.body.estado === 'Autorizada'){
        if(verNominaCompleta.Nominas.length < verNominaCompleta.totalEmpleados){
            return next(new AppError('Todos los empleados deben estar en la nomina',401))
        }
   }

    const newNominaCompleta = await nominaCompletaModel.findByIdAndUpdate(req.params.id,req.body)
    if(!newNominaCompleta) return next(new AppError('No existe nomina con este ID',404))
    res.status(201).json({
        status:'Success',
        newNominaCompleta
    })
})

exports.getNominaStats = catchAsync(async (req, res, next) => {
    const stats = await nominaCompletaModel.aggregate([
      {
        $match: { mes: 'Diciembre' }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      stats
    });
  });
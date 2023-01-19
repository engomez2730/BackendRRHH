const despidosModel = require('../models/despidosModel')
const nominaModel = require('../models/nominaModel')
const nominaCompleta = require('../models/nominaCompleta')
const employeeModel = require('../models/employeesModel')
const departamentoModel = require('../models/departamentosModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const calcular = require ('../utils/calcularVacaciones')


exports.crearDespido = catchAsync(async (req,res,next) =>{

  const usuario = await employeeModel.findByIdAndUpdate(req.params.id,{estado:false}).populate('Vacaciones')
  const departamentoChange = await departamentoModel.findOne({nombre:usuario.departamento})
  await departamentoModel.updateOne({_id:departamentoChange._id},{$pull:{Empleados:usuario._id}},{
    new:true,
    runValidators:true
  })

  let Vacaciones = false;
  if(usuario.Vacaciones.length === 0){
    Vacaciones = false
  }else if(new Date(usuario.Vacaciones[usuario.Vacaciones.length - 1].tiempoDeVacaciones[1]).getFullYear() === new Date().getFullYear()){
    if(new Date(usuario.Vacaciones[usuario.Vacaciones.length - 1]?.tiempoDeVacaciones[0]) < new Date()){
        Vacaciones = true
    }
  }else{
    Vacaciones = false;
  }


  const diasVacaciones = calcular.vacaciones(usuario.createdAt)
  const salarioVacaciones = calcular.sueldoVacaciones(usuario.sueldoFijo,diasVacaciones)
  const regalia = calcular.regalia(usuario.createdAt, usuario.sueldoFijo)
  const calcularVacaciones = calcular.calcularPrestaciones(usuario.createdAt,usuario.sueldoFijo,Vacaciones,salarioVacaciones,regalia)
  if(calcularVacaciones === 'No tiene derechos a prestaciones laborables aun'){
    req.body.prestacionesLaborables = 0
  }else{
    req.body.prestacionesLaborables = calcularVacaciones
  }

  req.body.Usuario = usuario._id

  const despido = await despidosModel.create(req.body)
  req.body.idUsuarioADD = usuario._id
  req.body.idDespidoADD = despido._id
  despidosModel.updateOne({_id:despido._id},{$pull:{Usuario:usuario._id}})
  next()
})

exports.verDespidos = catchAsync(async (req,res) =>{
    const Despidos = await despidosModel.find({}).populate({
        path:'Usuario',
        select:['-Nominas','-Vacaciones'], 
    })
    res.status(201).json({
        status:'Success',
        cantidadAnuncios:Despidos.length,
        Despidos
    })
})

exports.eliminarDespidos = catchAsync(async (req,res) =>{
    await despidosModel.deleteMany()
    res.status(201).json({
        status:'Success',
    })
})
exports.verDespido = catchAsync(async (req,res,next) =>{
    const despido = await despidosModel.findById(req.params.id).populate({
        path:'Usuario',
 
    })
    if(!despido) return next(new AppError('No hay Despido con este ID',404))
    res.status(201).json({
        status:'Success',
        despido
    })
})

exports.desvincular = catchAsync(async (req,res,next) =>{
    const usuario = await employeeModel.findByIdAndUpdate(req.body.Empleados,{estado:false}).populate({
        path:'Nominas'
        }).populate({
            path:'Vacaciones'
        })

        await departamentoModel.updateOne({departamento:usuario.departamento},{$pull:{Empleados:usuario._id}},{
        new:true,
        runValidators:true
        })

        let Vacaciones = false;
        if(usuario.Vacaciones.length === 0){
          Vacaciones = false
        }else if(new Date(usuario.Vacaciones[usuario.Vacaciones.length - 1].tiempoDeVacaciones[1]).getFullYear() === new Date().getFullYear()){
          if(new Date(usuario.Vacaciones[usuario.Vacaciones.length - 1]?.tiempoDeVacaciones[0]) < new Date()){
              Vacaciones = true
          }
        }else{
          Vacaciones = false;
        }

        let salarioVacaciones = 0
        const diasVacaciones = calcular.vacaciones(usuario.createdAt)
        if(!Vacaciones){
            salarioVacaciones = calcular.sueldoVacaciones(usuario.sueldoFijo,diasVacaciones) || 0
        }
        const regalia = calcular.regalia(usuario.createdAt, usuario.sueldoFijo)
        req.body.Vacaciones = salarioVacaciones
        req.body.regalia = regalia
        req.body.Usuario = usuario._id  
        const despido = await despidosModel.create(req.body)
    
    if(!usuario) return next(new AppError('No hay Despido con este ID',404))
    next()

  
})


exports.nominaDespido = catchAsync(async (req,res,next) =>{

  const empleado = await employeeModel.findById(req.body.Empleados).populate({
    path:'Nominas'
    }).populate({
        path:'Vacaciones'
    })



    empleado.Nominas?.forEach(e =>{
        if(e.nombreNomina === req.body.nombreNomina){
            return next(new AppError('Ya existe una nomina con este mes',401))
        }
    })





if(empleado.Vacaciones.length >= 0){

    var mes= ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre" ,"Octubre", "Noviembre" ,"Diciembre"];

    const mesVacaciones = new Date(empleado?.Vacaciones[empleado.Vacaciones.length -1]?.tiempoDeVacaciones[0]).getMonth()
    const yearVacaciones = new Date(empleado?.Vacaciones[empleado.Vacaciones.length -1]?.tiempoDeVacaciones[0]).getFullYear()
    const mesNomina = req.body.nombreNomina?.split(' ')[0]
    const yearNomina = Number(req.body.nombreNomina.split(' ')[1])

    if(mesNomina === mes[mesVacaciones] && yearVacaciones === yearNomina){
        req.body.salarioPorVacaciones = empleado.Vacaciones[empleado.Vacaciones.length -1].salarioPorVacaciones
    }
}

if(req.body.nombreNomina.split(' ')[0] === 'Diciembre'){
    req.body.regalia = calcular.regalia(empleado.createdAt,empleado.sueldoFijo)
}


let calculos;
if(req.body.tipoDeNomina === 'Nomina Fija'){
    calculos = calcular.nomina(req.body.sueldoFijo,0,req.body.tipoDeNomina,0,0)
}else{
    let horasTrabajadas = req.body.horasMensualesTrabajadas * req.body.costoPorHora
    let horasExtrasTotal = req.body.horasExtras * ((req.body.costoPorHora * 0.35) + req.body.costoPorHora) || 0
    let horasDoblesTotal = req.body.horasDobles * (req.body.costoPorHora * 2) || 0
    const totalSalario = horasTrabajadas + horasExtrasTotal + horasDoblesTotal || 0

   calculos = calcular.nomina(req.body.sueldoFijo,totalSalario,req.body.tipoDeNomina,0,0)
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
    salarioPorVacaciones: req.body.salarioPorVacaciones,
    regalia:req.body.regalia,
    prestacionesLaborables:req.body.prestacionesLaborables

}

const newNomina = await nominaModel.create(calculosFinal)
await nominaCompleta.updateOne({nombreNomina:req.body.nombreNomina},{$push:{Nominas:newNomina._id}},{
    new:true,
    runValidators:true
})

await employeeModel.updateOne({_id:req.body.Empleados},{$push:{Nominas:newNomina._id}},{
    new:true,
    runValidators:true
})
res.status(201).json({
    status:'Success',
    newNomina
})
})

exports.nominaDesvinculo = catchAsync(async (req,res,next) =>{
    const empleado = await employeeModel.findById(req.body.Empleados).populate({
      path:'Nominas'
      }).populate({
          path:'Vacaciones'
      })
  
  empleado.Nominas?.forEach(e =>{
      if(e.nombreNomina === req.body.nombreNomina){
          return next(new AppError('Ya existe una nomina con este mes',401))
      }
  })
  
 
  
  
  let calculos;
  if(req.body.tipoDeNomina === 'Nomina Fija'){
      calculos = calcular.nomina(req.body.sueldoFijo,0,req.body.tipoDeNomina,0,0)
  }else{
      let horasTrabajadas = req.body.horasMensualesTrabajadas * req.body.costoPorHora
      let horasExtrasTotal = req.body.horasExtras * ((req.body.costoPorHora * 0.35) + req.body.costoPorHora) || 0
      let horasDoblesTotal = req.body.horasDobles * (req.body.costoPorHora * 2) || 0
      const totalSalario = horasTrabajadas + horasExtrasTotal + horasDoblesTotal || 0
  
     calculos = calcular.nomina(req.body.sueldoFijo,totalSalario,req.body.tipoDeNomina,0,0)
  }

  calculos.sueldoNeto = calculos.sueldoNeto + req.body.regalia + req.body.Vacaciones
  calculos.sueldoBruto = calculos.sueldoBruto + req.body.regalia + req.body.Vacaciones

  
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
      salarioPorVacaciones: req.body.Vacaciones,
      regalia:req.body.regalia,
      prestacionesLaborables:req.body.prestacionesLaborables
  
  }
  
  const newNomina = await nominaModel.create(calculosFinal)
  await nominaCompleta.updateOne({nombreNomina:req.body.nombreNomina},{$push:{Nominas:newNomina._id}},{
      new:true,
      runValidators:true
  })
  
  await employeeModel.updateOne({_id:req.body.Empleados},{$push:{Nominas:newNomina._id}},{
      new:true,
      runValidators:true
  })
  res.status(201).json({
      status:'Success',
      newNomina
  })
})
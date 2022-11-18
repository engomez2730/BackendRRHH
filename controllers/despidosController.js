const despidosModel = require('../models/despidosModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')


exports.crearDespido = catchAsync(async (req,res) =>{
  const usuario = await employeeModel.findByIdAndUpdate(req.params.id,{estado:false})
  const despido = await despidosModel.create(req.body)
  await despidosModel.updateOne({_id:despido._id},{$push:{Usuario:usuario._id}},{
    new:true,
    runValidators:true
  })

  res.status(201).json({
      status:'Success',
      despido
  })
})

exports.verDespidos = catchAsync(async (req,res) =>{
    const Despidos = await despidosModel.find({}).populate({
        path:'Usuario', 
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
/*         select:'-nombre'
 */  
    })
    if(!despido) return next(new AppError('No hay Despido con este ID',404))
    res.status(201).json({
        status:'Success',
        despido
    })
})



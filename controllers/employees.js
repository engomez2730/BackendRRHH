const employeeModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const departamentoModel = require('../models/departamentosModel')
const despidosModel = require('../models/despidosModel')
const BenefModel = require('../models/BenefModel')
const factory = require('../utils/factory')
const multer = require('multer');
const sharp = require('sharp');



const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'public/photos');
   },
   filename: (req, file, cb) => {
     const ext = file.mimetype?.split('/')[1] || 'jpg';
     cb(null, `${'req.user.id'}-${Date.now()}.${ext}`);
   }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
  
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });

  exports.uploadUserPhoto = upload.single('photo');


exports.verEmpleados = catchAsync( async (req,res) =>{
    const queryObj = {...req.query}
    const excludeFields = ['page','sort','limit','fields']
    excludeFields.forEach(el => delete queryObj[el])
    const query = employeeModel.find(queryObj).populate({
      path:'Nominas'
    }).populate({
      path:'Vacaciones'
    }).populate({
      path:'Epps'
    }).populate({
      path:'Despidos'
    }).populate({
      path:'Licencias'
    })
    const Empleados = await query;
    const empleadosTotales = await employeeModel.find({})
    const empleadosInactivos = await employeeModel.find({estado:false})
   
    res.status(201).json({
        status:'Success',
        empleados:{
          Empleados,
          EmpleadosTotales:empleadosTotales.length,
          EmpleadosInactivos:empleadosInactivos.length
        }
    })
})


exports.eliminarEmpleados = catchAsync(async (req,res) =>{
    await employeeModel.deleteMany(req.body)
    res.status(201).json({
        status:'Success',
    })
})

exports.verEmpleado = catchAsync(async (req,res,next) =>{

  const doc = await employeeModel.findById(req.params.id).populate({
    path:'Nominas'
  }).populate({
    path:'Vacaciones'
  }).populate({
    path:'Epps'
  }).populate({
    path:'Licencias'
  })
  
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
})

exports.editarEmpleado =catchAsync(async (req,res,next) =>{
    console.log(req.body,req.file)
    let filterOBject = {...req.body}
    if(req.file){
        filterOBject.photo = req.file.filename
    }
    
    if(req.body.departamento){
      const departamentoEscogido = await departamentoModel.findOne({nombre:req.body.departamento})
      if(!departamentoEscogido) return next(new AppError('No existe departamento con este nombre',401))
      const usuario = await employeeModel.findById(req.params.id)
      const departamentoChange = await departamentoModel.findOne({nombre:usuario.departamento})

      await departamentoModel.updateOne({_id:departamentoChange._id},{$pull:{Empleados:usuario._id}},{
        new:true,
        runValidators:true
      })

      await departamentoModel.updateOne({_id:departamentoEscogido._id},{$push:{Empleados:usuario._id}},{
        new:true,
        runValidators:true
      })
    }
    const doc = await employeeModel.findByIdAndUpdate(req.params.id, filterOBject, {
        new: true,
        runValidators: true
    });
  
      if (!doc) {
        return next(new AppError('No se encontro ID con este Usuario', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
})
exports.eliminarEmpleado = catchAsync(async (req,res,next) =>{

  const empleadoEliminado = await employeeModel.findByIdAndUpdate(req.params.id,
      {estado:false}
  )

  res.status(200).json({
    status: 'success',
    empleadoEliminado
  });
})

exports.agregarBeneficio = catchAsync(async (req,res,next) =>{

  req.body.Beneficios.forEach(async e =>{
    console.log(e)
    await employeeModel.updateOne({_id:req.params.id},{$push:{Beneficios:e}},{
      new:true,
      runValidators:true
    })
  })
  res.status(200).json({
    status: 'success'
  });
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

exports.vacaciones = catchAsync(async (req,res,next) =>{
  const empleadoEditarVacaciones = await employeeModel.findByIdAndUpdate(req.params.id,req.body)
  res.status(201).json({
    status:'Success',
    empleadoEditarVacaciones
})})

exports.nomina = catchAsync(async (req,res,next) =>{
  const empleadoEditarVacaciones = await employeeModel.findById(req.params.id)
  empleadoEditarVacaciones.salarioBruto = req.body.salarioBruto
  empleadoEditarVacaciones.save({ validateBeforeSave: false })

/*   const empleadoEditarNomina = await employeeModel.save({_id:req.params.id,salarioBruto:req.body.salarioBruto}) 
 */  res.status(201).json({
    status:'Success',
/*     empleadoEditarNomina
 */})})

 exports.despedirEmpleado = catchAsync(async (req,res) =>{
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


exports.getEmpleadosStats = catchAsync(async (req, res, next) => {
  const stats = await employeeModel.aggregate([
    {
      $match:{estado:true}
    },
    {
      $group: {
        _id: { $toUpper: `$${req.query.query || "departamento"}` },
        numEmpleados: { $sum: 1 },
        avgSalario: { $avg: '$sueldoFijo' },
        salarioMenor: { $min: '$sueldoFijo' },
        salarioMayor: { $max: '$sueldoFijo' },
        totalNomina: { $sum: '$sueldoNeto' }
      }
    },
  ]);

  res.status(200).json({
    status: 'success',
    stats
  });
});

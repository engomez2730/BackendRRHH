const employeeModel = require('../models/employeesModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'public/photos');
   },
   filename: (req, file, cb) => {
     const ext = file.mimetype.split('/')[1];
     cb(null, `${req.user.id}-${Date.now()}.${ext}`);
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

    const Empleados = await employeeModel.find({})

    res.status(201).json({
        status:'Success',
        empleados:{
          Empleados
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
exports.editarEmpleado =catchAsync(async (req,res,next) =>{

    let filterOBject = {...req.body}
    if(req.file){
        filterOBject.photo = req.file.filename
    }

    const doc = await employeeModel.findByIdAndUpdate(req.params.id, filterOBject, {
        new: true,
        runValidators: true
    });
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
})
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


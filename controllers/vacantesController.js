const vacantesModel = require('../models/vacantesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'public/doc');
   },
   filename: (req, file, cb) => {
    console.log(req.file)
     const ext = file.mimetype.split('/')[1];
     cb(null, `${req.body.name}-${Date.now()}.${ext}`);
   }
   
});

const multerFilter = (req, file, cb) => {
    console.log(file)
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
  
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('doc');



exports.createVacante = factory.createOne(vacantesModel)
exports.verVacante = catchAsync(async (req,res,next) =>{

  
  const Vacantes = await vacantesModel.findById(req.params.id).populate({path:'Solicitantes'})

  res.status(201).json({
      status:'Success',
      data:{
        Vacantes
      }
  })
})
exports.editarVacante = catchAsync(async (req,res,next)=>{

    let filterOBject = {...req.body}
    if(req.file){
        filterOBject.doc = req.file.filename
    }
    const doc = await vacantesModel.findByIdAndUpdate(req.params.id, filterOBject, {
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
exports.eliminarVacante = factory.deleteOne(vacantesModel)

exports.verVacantes = catchAsync(async (req,res,next) =>{
  const Vacantes = await vacantesModel.find().populate({
    path:'Solicitantes'
})

res.status(201).json({
    status:'Success',
    cantidadDeDepartamentos:Vacantes.length,
    data:{
      Vacantes
    }
})
})



exports.nuevoSolicitante = catchAsync(async (req,res,next) =>{
 /*    console.log(req.file)
    console.log(req.body) */

    const filterOBject = {...req.body}
    if(req.file){
      filterOBject.curriculum = req.file.name || 'no tengo'
    }


    const nuevoSolicitante = await vacantesModel.updateOne(
        {_id:req.params.id},
        {$push:{Solicitantes:filterOBject}},{
        new:true,
        runValidators:true
    })

    if(!nuevoSolicitante) next(new AppError('No existe vacante con este ID',404))
    
    res.status(201).json({
        status:'success',
    })


})
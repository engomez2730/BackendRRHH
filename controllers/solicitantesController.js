const solicitantesModel = require('../models/solicitantesModel')
const vacantesModel = require('../models/vacantesModel')
const catchAsync =  require('../utils/catchAsync')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const multer = require('multer');

// Multer Configuration
const multerStorage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'public/doc');
   },
   filename: (req, file, cb) => {
     const ext = file.mimetype.split('/')[1];
     cb(null, `${req.body.nombre}-${Date.now()}.${ext}`);
   }
   
});

const multerFilter = (req, file, cb) => {
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

//Long Controllers 
exports.createSolicitante = catchAsync(async (req,res,next) =>{
    let filterObject = {...req.body}
    if(req.file){
        filterObject.doc = req.file.filename
    }
    const createSolicitante = await solicitantesModel.create(filterObject)
    const vacante = await vacantesModel.findById(req.params.id)
     await vacantesModel.updateOne(
        {_id:vacante._id},
        {$push:{Solicitantes:createSolicitante._id}}
        )
    res.status(201).json({
        status:'Success',
        data:{
            createSolicitante
        }
    })
}) 
exports.borrarSolicitantes = catchAsync(async (req,res,next) =>{

    await solicitantesModel.deleteMany()

    res.status(201).json({
        status:'Success'
    })
}) 
exports.editarSolicitante = catchAsync(async (req,res,next)=>{
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
exports.nuevoSolicitante = catchAsync(async (req,res,next) =>{
   
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

//Short Controllers
exports.verSolicitante = factory.getOne(solicitantesModel)
exports.eliminarSolicitantes = factory.deleteOne(solicitantesModel)
exports.verSolicitantes = factory.getAll(solicitantesModel)

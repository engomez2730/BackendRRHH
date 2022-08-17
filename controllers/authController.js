const employeeModel = require('../models/employeesModel')
const departamentoModel = require('../models/departamentosModel')

const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { promisify } = require('util');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res,req) => {

    const token = signToken(user._id);
    const cookieOptions = {
      httpOnly: true,
   /*    expires:new Date(
        Date.now() + process.env.JWT_SECRET_EXPIRES_IN * 24 * 60 * 60 * 1000
      ), */
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };


exports.crearEmpleado = catchAsync(async (req,res) =>{
    const newEmpleado = await employeeModel.create(req.body)
    const departamentoEscogido = await departamentoModel.findOne({nombre:newEmpleado.departamento})
    await departamentoModel.updateOne({_id:departamentoEscogido._id},{$push:{Empleados:newEmpleado._id}},{
      new:true,
      runValidators:true
    })
    const token = signToken(newEmpleado._id)
    res.status(201).json({
        status:'Success',
         token, 
        newEmpleado
    })
})

exports.signIn = catchAsync(async (req,res,next) =>{
    const {correo,password} = req.body;
    if(!correo || !password) return next( new AppError('Debe introducir correo y contraseña',401))
    const User = await employeeModel.findOne({correo:correo})
    if(!User || !(await User.correctPassword(password, User.password))){
        return next(new AppError('No hay usuarios que considan con ese correo',401)) 
    } 
    req.user = User
    createSendToken(User,404,res,req)

})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) next(new AppError('Tienes que estar logueado para ver esto', 401));
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await employeeModel.findById(decoded.id);
  if (!currentUser) next(new AppError('El usuario con este token ya no existe',401));
  
  req.user = currentUser;
  next();
});


exports.darPermisos = (...roles) =>{
  return (req,res,next)=>{
      if(!roles.includes(req.user.rol)) next(new AppError('No tienes permiso para ver eso',404))

      next()
  }
}
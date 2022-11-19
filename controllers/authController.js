const employeeModel = require('../models/employeesModel')
const departamentoModel = require('../models/departamentosModel')
const nominaModel = require('../models/nominaModel')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const calcularNomina = require('../utils/calcularVacaciones')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
    });
};

const createSendToken = (user, statusCode, res,req) => {
    const token = signToken(user._id);
    if(!token){
      console.log('GGGGG')
    }

    const cookieOptions = {
      expiresIn:  Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      httpOnly: false
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

exports.verLogin = (req,res,next) =>{
  res.status(201).json({
    status:'Success'
  })
}


exports.crearEmpleado = catchAsync(async (req,res,next) =>{

    req.body.cedula = Number(req.body.cedula)
    req.body.celular = Number(req.body.celular)
    //Departamentos
    const departamentoEscogido = await departamentoModel.findOne({nombre:req.body.departamento})
    if(!departamentoEscogido) return next(new AppError(`No existe departamento ${req.body.departamento}`,401))
    //Empleado
    const newEmpleado = await employeeModel.create(req.body)

    await departamentoModel.updateOne({_id:departamentoEscogido._id},{$push:{Empleados:newEmpleado._id}},{
      new:true,
      runValidators:true
    })


    createSendToken(newEmpleado,201,res,req)
    res.status(201).json({
        status:'Success',
        newEmpleado,token
    })
})

exports.signIn = catchAsync(async (req,res,next) =>{
  const {correo,password} = req.body;
    if(!correo || !password) return next( new AppError('Debe introducir correo y contraseña',401))
    const User = await employeeModel.findOne({correo:correo})
    if(!User || !(await User.correctPassword(password, User.password))){
        return next(new AppError('Contraseña o correo incorrectos',401)) 
    } 
    req.user = User 
    createSendToken(User,201,res,req)

})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }else if(req.cookies?.jwt){
    token = req.cookies.jwt 
  }
  if (!token){
    return next(new AppError('Tienes que estar logueado para ver esto', 401));
  }



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
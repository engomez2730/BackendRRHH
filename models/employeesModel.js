const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const calcular = require('../utils/calcularVacaciones')
const moment = require('moment')
moment.locale('es')

const employeesSchema = new mongoose.Schema({

    nombre:{
        type:String,
        required:[true,'Un empleado debe tener un nombre'],
    },
    apellido:{
        type:String,
        required:[true,'Un empleado debe tener un apellido'],
    },
    cedula:{
        type:Number,
        required:[true,'Un empleado debe tener una cedula'],
        unique:[true,'La cedula del empleado existe en la base de datos']
    },
    direccion:{
        type:String,
        required:[true,'Un empleado debe tener una cedula'],
    },
    celular:{
        type:Number,
        required:[true,'Un empleado debe tener una telefono'],
        unique:[true,'El numero de telefono del empleado existe en la base de datos']

    },
    correo:{
        type:String,
        unique:[true,'Este correo ya existe'],
        required:[true,'Un empleado debe tener una correo'],

    },
    provincia:{
        type:String,
        required:[true,'Un empleado debe tener una provincia'],
        enum : ['Azua','Barahuco','Barahona','Dajabon','Distrito Nacional',
        'Duarte','Elias Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal',
        'Independencia','La Altagracias','La Romana','La Vega','Maria Trinidad Sanchez',
        'Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata',
        'Samana','Sanchez Ramirez','San Cristobal','San Jose de Ocoa','San Juan','San Pedro de Macoris',
        'Santiago','Santiago Rodriguez','Santo Domingo','Valverde'],
        default: 'Monseñor Nouel'
    },
    pais:{
        type:String,
        required:[true,'Un empleado debe tener un pais']
    },
    createdAt:{
        type:Date,
        default: moment().format()  
    },
    password:{
        type:String,
        required:[true,'Un Usuario debe tener una contraseña'],
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:[true,'Un Usuario debe tener una contraseña'],
        minlength:8
    },
    estado:{
        type:Boolean,
        default:true
    },
    contrato:{
        type:String,
        default:true,
        enum:['definido','indefinido','temporal'],
        required:[true,'Un empleado debe tener un contrato']
    },
    puesto:{
        type:String
    },
    vacaciones:{
        type:String
    },
    prestacionesLaborables:{
        type:String,
    },
    rol:{
        type:String,
        required:[true,'Un usuario debe tener un rol'],
        default:'empleado',
        enum:['empleado','supervisor','admin']
    },
    salarioBruto:{
        type:Number,
        required:[true,'Un empleado debe tener un salario']
    },
    prestacionesLaborales:{
        type:String
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


employeesSchema.virtual('PrestacionesLaborales').get(function() {
    return this.tiempoEnLaEmpresa = calcular.calcularPrestaciones(this.createdAt,this.salarioBruto)
});

employeesSchema.virtual('DiaDeVacaciones').get(function() {
    return this.DiaDeVacaciones = calcular.vacaciones(this.createdAt,this.salarioBruto)
});

employeesSchema.virtual('salarioPorVacaciones').get(function() {
    return this.DiaDeVacaciones = this.salarioBruto * calcular.vacaciones(this.createdAt,this.salarioBruto) / 23.83 
});

employeesSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

employeesSchema.pre('save', async function(next){
    if(!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
})

const userModel = new mongoose.model('Empleados',employeesSchema)

module.exports = userModel;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const calcular = require('../utils/calcularVacaciones')
const moment = require('moment')
moment.locale('es')

const employeesSchema = new mongoose.Schema({

    nombre:{
        type:String,
        unique:false,
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
        required:[true,'Un empleado debe tener este campo'],
        unique:[true,'El numero de telefono del empleado existe en la base de datos']

    },
    correo:{
        type:String,
        unique:[true,'Este correo ya existe'],

    },
    provincia:{
        type:String,
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
        required:[true,'Un empleado debe tener este campo'],

    },
    createdAt:{
        type:Date,
        default: moment().format()  
    },
    password:{
        type:String,
        required:[true,'Un empleado debe tener este campo'],
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:[true,'Un empleado debe tener este campo'],
        minlength:8

    },
    estado:{
        type:Boolean,
        default:true
    },
    contrato:{
        type:String,
        default:'indefinido',
        enum:['definido','indefinido','temporal'],
    },
    puesto:{
        type:String
    },
    vacacionesTomadas:{
        type:Boolean,
        default:false
    }, 
    tiempoDeVacaciones:{
        type:Array,
        default:null
    },
    salarioPorVacaciones:{
        type:Number,
        default:null
    },
    prestacionesLaborables:{
        type:String,
    },
    rol:{
        type:String,
        default:'empleado',
        enum:['empleado','supervisor','admin']
    },
    salarioBruto:{
        type:Number,
    },
    salario:{
        type:Number
    },
    prestacionesLaborales:{
        type:String
    },
    sexo:{
        type:String,
        required:[true,'Un empleado debe tener este campo'],
        enum:['Hombre','Mujer','Otro']
    },
    fechaDeNacimiento:{
        type:Date,
        require:[true,'necesita una edad']
    },
    ausencias:{
        type:Number,
        default:0
    },
    vencimientoDelContrato:{
        type:Date,
        required:false,
    },
    photo:{
        type:String
    },
    departamento:{
        type:String,
        enum:['Administracion','Taller','Barrick','Falcondo','Planta de Agregados','Inmobiliaria','Rio','Topografia','Campamento']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


//Virtuals 

employeesSchema.virtual('tiempoEnLaEmpresa').get(function() {
    return this.tiempoEnLaEmpresa = moment(this.createdAt).fromNow()
});

employeesSchema.virtual('DiaDeVacaciones').get(function() {
    return this.DiaDeVacaciones = calcular.vacaciones(this.createdAt,this.salarioBruto)
});

/* employeesSchema.virtual('salarioPorVacaciones').get(function() {
    return this.salarioPorVacaciones = this.salarioBruto * calcular.vacaciones(this.createdAt,this.salarioBruto) / 23.83 
}); */

employeesSchema.virtual('regalia').get(function() {
    return this.regalia = calcular.regalia(this.createdAt,this.salarioBruto)
});
employeesSchema.virtual('vacacionesDisponibles').get(function() {
    return calcular.vacacionesDisponibles(this.createdAt)
});

employeesSchema.virtual('PrestacionesLaborales').get(function() {
    return this.PrestacionesLaborales = calcular.calcularPrestaciones(this.createdAt,this.salarioBruto,this.vacacionesTomadas,this.salarioPorVacaciones,this.regalia)
});

//Methods

employeesSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    console.log(this)
    //
    this.fechaDeNacimiento = moment(this.fechaDeNacimiento).fromNow()
    next();
  });

employeesSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};



const userModel = new mongoose.model('Empleados',employeesSchema)

module.exports = userModel;
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('es')
const personasEntrevistadas = new mongoose.Schema({

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
    estado:{
        type:Boolean,
        default:true
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const EntrevistadosModel = new mongoose.model('Entrevistados',personasEntrevistadas)

module.exports = EntrevistadosModel
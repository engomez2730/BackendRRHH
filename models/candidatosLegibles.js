const mongoose = require('mongoose')

const candidatosSchema = new mongoose.Schema({

   
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
        required:[true,'Un empleado debe tener una correo'],
    },
    puestoSolicitado:{
        type:String,
        required:[true,'Un empleado debe tener una correo'],
    },
    createdAt:{
        type:Date,
        default: new Date()
    },
    state:{
        type:Boolean,
        default:true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const candidatosModel = new mongoose.model('Candidatos',candidatosSchema)

modules.exports = candidatosModel
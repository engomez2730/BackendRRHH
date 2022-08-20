const mongoose = require('mongoose')

const solicitantesSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:[true,'Un Solicitante debe tener un nombre'],

    },
    apellido:{
        type:String,
        required:[true,'Un Solicitante debe tener un apellido'],
    },
    cedula:{
        type:Number,
        required:[true,'Un Solicitante debe tener una cedula'],
        unique:[true,'La cedula del empleado existe en la base de datos']
    },
    celular:{
        type:Number,
        required:[true,'Un Solicitante debe tener una telefono'],
        unique:[true,'El numero de telefono del empleado existe en la base de datos']

    },
    correo:{
        type:String,
        required:[true,'Un Solicitante debe tener una correo'],
    },
    curiculum:{
        type:String
    },
    createdAt:{
        type:Date,
        default: new Date()
    },
    doc:{
        type:String
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


const solicitantesModel = new mongoose.model('Solicitantes',solicitantesSchema)

module.exports = solicitantesModel
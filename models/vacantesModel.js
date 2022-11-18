const mongoose = require('mongoose')

const vacantesSchema = new mongoose.Schema({

    nombre:{
        type:String,
        require:[true,'Una vacante debe tener un titulo']
    },
    trabajadoresRequeridos:{
        type:String,
        required:[true,'Una vacante debe tener un numero de trabajdores']
    },
    horario:{
        type:String
    },
    puesto:{
        type:String,
        required:[true,'Una vacante debe tener un puesto'] 
    },
    descripcion:{
        type:String,
        required:[true,'Una vacante debe tener una descripcion']
    },
    razonApertura:{
        type:String
    },
    Solicitantes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Solicitantes'
        }
    ],
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


const vacantesModel = new mongoose.model('Vacantes',vacantesSchema)

module.exports = vacantesModel
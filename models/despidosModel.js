const mongoose = require('mongoose')

const despidosSchema = new mongoose.Schema({
    razon:{
        type:String
    },
    descripcion:{
        type:String,
        required:[true,'Un Despido debe tener un descripcion'],
    },
    fechaDespido:{
        type:Date,
        default:Date.now()
    },
    Usuario:{
            type:mongoose.Schema.ObjectId,
            ref:'Empleados'
    }
    ,
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const despidosModel = new mongoose.model('Despidos',despidosSchema)

module.exports = despidosModel;
const mongoose = require('mongoose')

const despidosSchema = new mongoose.Schema({
    razon:{
        type:String,
    },
    descripcion:{
        type:String,
        required:[true,'Un Despido debe tener un descripcion'],
    },
    fechaDespido:{
        type:Date,
        default:Date.now()
    },
    prestacionesLaborables:{
        type:Number,
        default:0
    },
    tipoDeDespido:{
        type:String,
        enum:['Renuncia','Despido']
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

despidosSchema.pre('save', async function(next) {
    next();
  });


const despidosModel = new mongoose.model('Despidos',despidosSchema)

module.exports = despidosModel;
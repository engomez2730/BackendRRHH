const mongoose = require('mongoose')

const vacacionesSchema = new mongoose.Schema({

    estado:{
        type:Boolean,
        default:true
    }, 
    tiempoDeVacaciones:{
        type:Array,
        default:null
    },
    salarioPorVacaciones:{
        type:Number,
        default:null
    },
    diasDeVacaciones:{
        type:Number,
        default:0
    },
    siguientesVacacionesFecha:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    Empleados:[{
            type:mongoose.Schema.ObjectId,
            ref:'Empleados'
    }
    ]},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

vacacionesSchema.pre('save', async function(next) {

   next();
 });



const vacacionesModel = new mongoose.model('Vacaciones',vacacionesSchema)

module.exports = vacacionesModel
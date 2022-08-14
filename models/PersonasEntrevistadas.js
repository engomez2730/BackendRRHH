const mongoose = require('mongoose')

const personasEntrevistadas = new mongoose.Schema({

    nombre:{
        type:String,
        require:[true,'Una vacante debe tener un titulo']
    },
    trabajadoresRequeridos:{
        type:String,
        required:[true,'Una vacante debe tener un numero de trabajdores']
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


const EntrevistadosModel = new mongoose.model('Entrevistados',personasEntrevistadas)

modules.exports = EntrevistadosModel
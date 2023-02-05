const mongoose = require('mongoose')

const BeneficiosSchema = new mongoose.Schema({
    dieta:{
        type:Number,
        default:null
    },
    incentivos:{
        type:Number,
        default:null
    },
    estudios:{
        type:Array,
    },
    comida:{
        type:Boolean,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



const BeneficiosModel = new mongoose.model('Beneficios',BeneficiosSchema)

module.exports = BeneficiosModel;
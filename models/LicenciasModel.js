const mongoose = require('mongoose')
const moment = require('moment')

const LicenciaSchema = new mongoose.Schema({
    descripcion:{
        type:String,
        required:[true,'Una Licencia debe tener una descripción']
    },
    razon:{
        type:String,
        required:[true,'Una Licencia debe tener una razon']
    },
    tiempoDeLicencia:{
        type:Array,
        required:[true,'Una Licencia debe tener los dias de licencia']
    },
    lugarDelReposo:{
        type:String,
        required:[true,'Una Licencia debe tener una diasDeLicencia']
    },
    Imagen:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()    
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


const LicenciasModel = new mongoose.model('Licencias',LicenciaSchema)

module.exports = LicenciasModel;
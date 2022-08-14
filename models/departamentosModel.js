const mongoose = require('mongoose')

const departamentoSchema = new mongoose.Schema({

    nombre:{
        type:String,
        required:[true,'Un empleado debe tener un nombre'],
        enum:['Administracion','Taller','Barrick','Falcondo','Planta de Agregados','Inmobiliaria','Rio','Topografia','Campamento']
    },
    encargado:{
        type:String,
        required:[true,'Un empleado debe tener un nombre'],
    },
    descripcion:{
        type:String,
        required:[true,'Un empleado debe tener un nombre'],
    },
    createdAt:{
        type:Date,
        default: new Date()
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

const departamentoModel = new mongoose.model('Departamentos',departamentoSchema)

module.exports = departamentoModel;
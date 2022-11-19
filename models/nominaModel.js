const mongoose = require('mongoose')
const calcular = require('../utils/calcularVacaciones')
const moment = require('moment')
moment.locale('es')

const nominaSchema = new mongoose.Schema({

    tipoNomina:{
        type:String,
        default:'Nomina Fija',
        required:[true,'Un empleado debe tener tipo de nomina'],
        enum:['Nomina Fija','Por Hora']
    },
    costoPorHora:{
        type:Number,
        default:null
    },
    sueldoBruto:{
        type:Number,
        required:[true,'Un empleado debe tener un sueldo Bruto'],
    },
    sueldoNeto:{
        type:Number,
        required:[true,'Un empleado debe tener un sueldo Neto'],
    },
    sueldoAnual:{
        type:Number,
        required:[true,'Un empleado debe tener un sueldo Anual'],
    },
    afp:{
        type:Number,
        required:[true,'Un empleado debe tener un afp'],
    },
    sfs:{
        type:Number,
        required:[true,'Un empleado debe tener un sfs'],
    },
    isr:{
        type:Number,
        required:[true,'Un empleado debe tener un isr'],
    },
    totalDescuento:{
        type:Number,
        required:[true,'Un empleado debe tener un Total Descuento'],
    },
    totalSinAhorro:{
        type:Number,
        required:[true,'Un empleado debe tener un Total Sin Ahorro'],
    },
    estado:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    Empleados:{
            type:mongoose.Schema.ObjectId,
            ref:'Empleados'
    }
    ,
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



const nominaModel = new mongoose.model('Nomina',nominaSchema)

module.exports = nominaModel;
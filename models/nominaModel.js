const mongoose = require('mongoose')
const calcular = require('../utils/calcularVacaciones')
const moment = require('moment')
moment.locale('es')

const nominaSchema = new mongoose.Schema({

    tipoDeNomina:{
        type:String,
        default:'Nomina Fija',
        required:[true,'Un empleado debe tener tipo de nomina'],
        enum:['Nomina Fija','Por Hora']
    },
    costoPorHora:{
        type:Number,
        default:null
    },
    nombreNomina:{
        type:String,
    },
    horasMensualesTrabajadas:{
        type:Number,
    },
    horasDobles:{
        type:Number,
    },
    horasExtras:{
        type:Number,
    },
    sueldoBruto:{
        type:Number,
        default:0
    },
    sueldoNeto:{
        type:Number,
        default:0

    },
    sueldoAnual:{
        type:Number,
        default:0
    },
    afp:{
        type:Number,
    },
    sfs:{
        type:Number,
    },
    isr:{
        type:Number,
    },
    totalDescuento:{
        type:Number,
    },
    totalSinAhorro:{
        type:Number,
    },
    descuentos:{
        type:Number,
    },
    bonus:{
        type:Number,
    },
    mes:{
        type:String,
    },
    year:{
        type:Number
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

var mes= ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre" ,"Octubre", "Noviembre" ,"Diciembre"];

nominaSchema.pre('save', async function(next) {
        this.sueldoNeto = this.sueldoNeto + this.bonus - this.descuentos
        this.totalDescuento =  this.totalDescuento + this.descuentos
        this.year = Number(this.nombreNomina.split(' ')[1])
        this.mes = this.nombreNomina.split(' ')[0]
        next()
})


const nominaModel = new mongoose.model('Nomina',nominaSchema)

module.exports = nominaModel;
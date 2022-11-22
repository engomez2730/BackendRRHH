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
        unique:[true,'La Fecha de la nomina esta repetida']
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
    },
    sueldoNeto:{
        type:Number,
    },
    sueldoAnual:{
        type:Number,
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
    mes:{
        type:String,
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
        console.log(this.year = new Date(this.createdAt).getFullYear())
        this.year = new Date(this.createdAt).getFullYear()
        this.mes = mes[new Date(this.createdAt).getMonth()]
        this.nombreNomina = `${this.mes} ${this.year}`
        next()
})


const nominaModel = new mongoose.model('Nomina',nominaSchema)

module.exports = nominaModel;
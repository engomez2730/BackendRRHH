const mongoose = require('mongoose')
const calcular = require('../utils/calcularVacaciones')
const moment = require('moment')
moment.locale('es')

const nominaCompletaSchema = new mongoose.Schema({

    fecha:{
        type:Date,
        required:[true,'Una Nomina necesita una fecha'],
    },
    mes:{
        type:String,
    },
    year:{
        type:String,
    },
    nombreNomina:{
        type:String,
        unique:[true,'La Fecha de la nomina esta repetida']
    },
    totalPagar:{
        type:Number,
    },
    totalEmpleados:{
        type:Number,
    },
    estado:{
        type:String,
        enum:['Pendiente','Completa','Autorizada'],
        default:'Pendiente'
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    Nominas:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Nomina'
        }
    ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

var mes= ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre" ,"Octubre", "Noviembre" ,"Diciembre"];

nominaCompletaSchema.pre('save', async function(next) {
        this.year = new Date(this.fecha).getFullYear()
        this.mes = mes[new Date(this.fecha).getMonth()]
        this.nombreNomina = `${this.mes} ${this.year}`
        next()
})


const nominaCompletaModel = new mongoose.model('NominaCompleta',nominaCompletaSchema)

module.exports = nominaCompletaModel;
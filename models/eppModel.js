const mongoose = require('mongoose')
const moment = require('moment')

const eppSchema = new mongoose.Schema({
    camisa:{
        type:Boolean,
        required:[true,'Debe tener un estado de camisa']
    },
    botas:{
        type:Boolean,
        required:[true,'Debe tener un estado de botas']
    },
    lentes:{
        type:Boolean,
        required:[true,'Debe tener un estado de lentes']
    },
    createdAt:{
        type:Date,
        default:Date.now()    
    },
    siguienteFechaEntrega:{
        type:Date
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

eppSchema.pre('save', async function(next) {
    this.siguienteFechaEntrega = moment(this.createdAt).add(6, 'months');
    next();
});


const eppModel = new mongoose.model('Epp',eppSchema)

module.exports = eppModel;
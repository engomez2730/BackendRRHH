const mongoose = require('mongoose')

const anuncioSchema = new mongoose.Schema({

    titulo:{
        type:String,
        required:[true,'Un empleado debe tener un titulo'],
    },
    descripcion:{
        type:String,
        required:[true,'Un empleado debe tener un nombre'],
    },
    createdAt:{
        type:Date,
        default: new Date()
    },

    finishAt:{
        type:Date,
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

anuncioSchema.pre('save', async function(next){
    if(!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
})

const anuncioModel = new mongoose.model('Anuncios',anuncioSchema)

module.exports = anuncioModel;
const mongoose = require('mongoose')

const permisosSchema = new mongoose.Schema({

    nombre:{
        type:String,
        required:[true,'Un permiso debe tener un nombre'],
    },
    descripcion:{
        type:String,
        required:[true,'Un permiso debe tener una descripcion'],
    },
    createdAt:{
        type:Date,
        default: new Date()
    },
    fecha:{
        type:Date,
    },
    estado:{
        type:Boolean,
        default:true
    },
    Empleados:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Empleados'
        }
    ],
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

permisosSchema.pre('save', async function(next){
    if(!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    next();
})

const permisosModel = new mongoose.model('Permisos',permisosSchema)

module.exports = permisosModel;
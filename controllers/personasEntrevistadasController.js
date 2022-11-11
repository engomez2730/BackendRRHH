const EntrevistadosModel = require('../models/PersonasEntrevistadas')
const factory = require('../utils/factory')
const AppError = require('../utils/appErrorClass')
const catchAsync =  require('../utils/catchAsync')



exports.createEntrevistado = factory.createOne(EntrevistadosModel)


exports.verEntrevistados =catchAsync(async(req,res,next) =>{

    const queryObj = {...req.query}
    const excludeFields = ['page','sort','limit','fields']
    excludeFields.forEach(el => delete queryObj[el])
    const query = EntrevistadosModel.find(queryObj)
    const Entrevistados = await query;
    res.status(201).json({
        status:'Success',
        Entrevistados
    })
})
exports.verEntrevistado = factory.getOne(EntrevistadosModel)
exports.editarEntrevistado = factory.updateOne(EntrevistadosModel)
exports.eliminarEntrevistado = factory.deleteOne(EntrevistadosModel)







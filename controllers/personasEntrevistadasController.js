const EntrevistadosModel = require('../models/PersonasEntrevistadas')
const factory = require('../utils/factory')

exports.createEntrevistado = factory.createOne(EntrevistadosModel)
exports.verEntrevistados = factory.getAll(EntrevistadosModel)
exports.verEntrevistado = factory.getOne(EntrevistadosModel)
exports.editarEntrevistado = factory.updateOne(EntrevistadosModel)
exports.eliminarEntrevistado = factory.deleteOne(EntrevistadosModel)







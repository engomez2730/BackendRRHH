const express = require('express')
const app = express()
const AppError = require('./utils/appErrorClass')
const errorController = require('./controllers/errorController')

process.setMaxListeners(0);
const employeesRoute = require('./routes/employeesRote')
const departamentoRoute = require('./routes/departamentosRoutes.js')
const anunciosRoute = require('./routes/anunciosRoutes.js')
const entrevistados = require('./routes/entrevistadosRoute.js')
const rootRoute = require('./routes/rootRoute')

app.use(express.json({ limit: '20kb' }));
/* app.use((req,res,next)=>{
    
}) */
app.use('/api/v1/',rootRoute)
app.use('/api/v1/empleados',employeesRoute)
app.use('/api/v1/departamentos',departamentoRoute)
app.use('/api/v1/anuncios',anunciosRoute)
app.use('/api/v1/entrevistados',entrevistados)
app.all('*',(req,res,next) =>{
    next(new AppError(`La ruta ${req.originalUrl} no existe ☹`,404))
})

app.use(errorController)


module.exports = app
const express = require('express')
const app = express()
const AppError = require('./utils/appErrorClass')
const errorController = require('./controllers/errorController')
const employeesRoute = require('./routes/employeesRote')
const rootRoute = require('./routes/rootRoute')

app.use(express.json({ limit: '20kb' }));
/* app.use((req,res,next)=>{
    
}) */
app.use('/api/v1/',rootRoute)
app.use('/api/v1/empleados',employeesRoute)
app.all('*',(req,res,next) =>{
    next(new AppError(`La ruta ${req.originalUrl} no existe ☹`,404))
})

app.use(errorController)


module.exports = app
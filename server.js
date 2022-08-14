const app = require('./app')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './config.env') })

//Base de datos conexion
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Base de Datos conectada'));

//Arrancando el servidor 
const port = process.env.PORT || 3000 

app.listen(port,()=>{
    console.log('The Server has started')
})
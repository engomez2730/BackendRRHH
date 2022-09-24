const express = require('express')
const Router = express.Router()
const employeesController = require('../controllers/employees')
const authController = require('../controllers/authController')


Router
.route('/login')
.post(authController.signIn)
.get(authController.verLogin)




module.exports = Router
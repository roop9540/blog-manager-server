const express = require('express');
const { register, login, protected } = require('./user.controller');



const authRouter = express.Router();
 authRouter.post('/register', register)
 authRouter.post('/login', login)
 authRouter.get('/verify', protected)

module.exports = authRouter;
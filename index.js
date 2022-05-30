const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();
  

const app = express();

dbConnection();

app.use( express.static('public')); 
app.use( cors() );  
app.use(morgan('dev'));

app.use( express.json());
app.use('/api/auth', require('./routes/auth'));


app.listen(process.env.PORT , () => {
    console.log(`Servidor corriendo en el puerto ${ 4000 }`);   
});
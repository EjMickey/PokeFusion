const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const userController = require("./routes/userRoutes.js")
const pokeController = require("./routes/pokeRoutes.js")
const mongoose = require('mongoose')
// Load .env Enviroment Variables to process.env

require('mandatoryenv').load([
    'DB_URL',
    'PORT',
    'JWT_SECRET'
]);

const { PORT } = process.env;


// Instantiate an Express Application
const app = express();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Połączono z MongoDB'))
.catch(err => console.error('Błąd połączenia:', err));
  

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Handle errors
app.use(errorHandler());
app.use(userController);
app.use(pokeController);
// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);
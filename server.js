'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./backend/database/db')

const productRoute = require('./backend/routes/product-rte');
const orderRoute = require('./backend/routes/order-rte');

// Connecting with mongo db
mongoose.Promise = global.Promise;
const db  = process.env.MONGODB_URL || dbConfig.db;
mongoose.connect(db, {
   useNewUrlParser: true
}).then(() => {
   console.log('directory path', __dirname);
      console.log(`Database is sucessfully connected at ${db}`);
   },
   error => {
      console.log('Database could not be connected: ' + error)
   }
);

// Setting up port with express js
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors());

// Create link to angular build directory
const distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use('/', express.static(distDir));


app.use('/api/v1', productRoute);
app.use('/api/v1', orderRoute);


const server = app.listen(process.env.PORT || 8080, () => {
   const port = server.address().port;
  console.log('Connected to port ' + port);
  console.log('app locals', app.locals);
});

 
 // error handler
 app.use(function (err, req, res, next) {
   console.error(err.message); // Log error message in our server's console
   if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
   res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
 });


 const express = require('express');

require('./db/mongoose.js');

const path = require('path');
const app = express();
const router = require('../src/router');
const crudMethod = require('../src/crud-metho');

const hbs = require('hbs');


// const { getMaxListeners } = require('process');

const port = process.env.PORT; 

app.use(express.json());
app.use(express.urlencoded({ extended: false}))
//define path for express config
var publicDirectoryFolder = path.join(__dirname, '../public');
var viewPath = path.join(__dirname, '../templates/views')
var partialPath=path.join(__dirname,'../templates/partials')








//set up static directory to serve
app.use(express.static(publicDirectoryFolder));
app.use(router);

//set up handlebars and view location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath);


app.listen(port, () => {
    console.log('server is up');
})
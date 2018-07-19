'use strict';


const express = require('express');
var path = require('path');
const app = express();
const bodyParser = require('body-parser');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');

const BUCKET = 'img-con-bkt';

const config = require('./config');
const jwt    = require('jsonwebtoken');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout:'frontend',
    helpers: require("./helpers.js").helpers
}));
app.set('view engine', 'handlebars');

app.use(expressValidator());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    next();
});
mongoose.connect(config.database);

const auth = require('./routes/auth');
const admin = require('./routes/admin');
const converter = require('./routes/converter');

app.get('/', function (req, res) {
    res.render('frontend/home');
});

app.use('/auth', auth);
app.use('/admin', admin);
app.use('/convert', converter);

const port = config.port;

console.log(port);

app.listen(port);
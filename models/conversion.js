var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const config = require('../config');

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Conversion', new Schema({ 
    source: String, 
    target: String, 
    extra_params: String, 
    pages: String, 
    software: String
}));

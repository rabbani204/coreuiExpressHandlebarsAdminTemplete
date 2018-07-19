var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let SubGroupSchema = Schema({ 
    name: String,
    group: { type: Schema.ObjectId, ref: 'Group' }
})


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Group', new Schema({ 
    name: String,
    subgroup: [ SubGroupSchema ]
}));
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('FileType', new Schema({ 
    ext: String,
    primery: Boolean,
    listed: Boolean,
    same_as: String,
    name: String,
    type: String,
    group: { type: Schema.ObjectId, ref: 'Group' },
    sub_group: { type: Schema.ObjectId, ref: 'Subgroup' }
}));
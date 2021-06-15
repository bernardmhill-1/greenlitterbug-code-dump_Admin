var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contentschema = new Schema({
    _id: { type: String, required: true },
    title: { type: String,required: true},
    description: { type: String,required: true},
    content_type: { type: String,required: true}
}, {
        timestamps: true
    });
module.exports = mongoose.model('Content', contentschema);
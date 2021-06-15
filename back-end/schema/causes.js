var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Causeschema = new Schema({
    _id: { type: String, required: true },
    title: { type: String,required: true},
    description: { type: String,required: true},
    image: [{
        _id: { type: String,default: ''},
        imageUrl: { type: String, default: '' }
    }],
    document: [{
        _id: { type: String,default: ''},
        title: { type: String, default: '' },
        fileUrl: { type: String, default: '' }
    }],
}, {
        timestamps: true
    });
module.exports = mongoose.model('Cause', Causeschema);
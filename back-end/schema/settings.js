var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var settingschema = new Schema({
    _id: { type: String, required: true },
    title: { type: String,required: true},
    keyword: { type: String,required: true},
    value: { type: String,required: true}
}, {
        timestamps: true
    });
module.exports = mongoose.model('Setting', settingschema);
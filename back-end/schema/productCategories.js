var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productCategorieschema = new Schema({
    _id: { type: String, required: true },
    category: { type: String, required: false }
}, {
        timestamps: true
    });
module.exports = mongoose.model('productCategory', productCategorieschema);
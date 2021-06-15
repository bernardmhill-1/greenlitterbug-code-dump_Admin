var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var productbarcodeSchema = new Schema({
    _id: { type: String, required: true },
    productType: { type: String, required: false },
    name: { type: String, default: ''},
    barcode: { type: String, default: '' },
    image: { type: String, default: '' },
}, {
        timestamps: true
    });
module.exports = mongoose.model('productBarcode', productbarcodeSchema);
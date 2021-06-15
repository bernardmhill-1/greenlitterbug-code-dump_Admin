var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shippingAddressSchema = new Schema({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    addressOne: { type: String, required: false },
    addressTwo: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false }
}, {
        timestamps: true
    });
module.exports = mongoose.model('shippingAddress', shippingAddressSchema);
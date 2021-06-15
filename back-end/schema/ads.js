var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var adsSchema = new Schema({
    vendorId: { type: String, required: false, ref: 'Vendor' },
    image: { type: String, default: '' },
    content: { type: String, default: '' },
    isFeatured: { type: String, enum: ['yes', 'no'], default: 'no' }
}, {
        timestamps: true
    });
module.exports = mongoose.model('Ads', adsSchema);
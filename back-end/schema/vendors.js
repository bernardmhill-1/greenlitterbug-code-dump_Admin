var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var vendorschema = new Schema({
    _id: { type: String, required: true },
    companyName: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    companyLogo: { type: String, default: '' },
    description: { type: String, default: '' },
    email: { type: String, default: '' },
    phoneNo: { type: String, default: '' },
    address: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    isFeatured: { type: String, enum: ['yes', 'no'], default: 'no' }
}, {
        timestamps: true
    });
module.exports = mongoose.model('Vendor', vendorschema);
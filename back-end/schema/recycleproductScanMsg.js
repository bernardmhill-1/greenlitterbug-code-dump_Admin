var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recycleproductScanMsgschema = new Schema({
    _id: { type: String, required: true },
    productType: { type: String, required: true },
    number: { type: String, enum: [1,10,20,50,75,100], required: true },
    message: { type: String, required: true }
}, {
        timestamps: true
    });
module.exports = mongoose.model('Recycleproduct-scan-messege', recycleproductScanMsgschema);
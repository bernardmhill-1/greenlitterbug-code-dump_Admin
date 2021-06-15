var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var temporaryCartschema = new Schema({
    _id: { type: String, required: true },
    userId: { type: String,required: true},
    productId: { type: String,required: true},
    qty: { type: Number,required: true},
    unitPoint:{ type: Number,required: true},
    totalPoint:{ type: Number,required: true},
}, {
        timestamps: true
    });
module.exports = mongoose.model('temporaryCart', temporaryCartschema);
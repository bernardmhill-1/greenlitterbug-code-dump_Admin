var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recycleProductschema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, required: true },
    productType: { type: String, required: false },
    companyName: { type: String,required: false},
    productImage: { type: String,required: false},
    barCodeImage: { type: String,required: false},
    binCode: { type: String,required: false, default: ''},
    barCode: { type: String,required: false, default: ''},
    reward: { type: Number,required: false},
    place: { type: String,required: false},
    addStatus: { type: String, enum: ['yes', 'no'], default: 'no'},
}, {
        timestamps: true
    });
module.exports = mongoose.model('RecycleProduct', recycleProductschema);
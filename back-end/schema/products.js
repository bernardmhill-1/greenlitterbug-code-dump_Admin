var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productschema = new Schema({
    _id: { type: String, required: true },
    category: { type: String, required: false },
    vendor: { type: String, required: false },
    name: { type: String, required: false },
    description: { type: String, required: false },
    qty: { type: Number, required: false },
    point: { type: Number, required: false },
    image: [{
        _id: { type: String, default: '' },
        imageUrl: { type: String, default: '' }
    }],
    isPopular: { type: String, enum: ['yes', 'no'], default: 'no' }
}, {
        timestamps: true
    });
module.exports = mongoose.model('Product', productschema);
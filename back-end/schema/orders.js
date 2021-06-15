var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderschema = new Schema({
    _id: { type: String, required: true },
    orderId: { type: String, required: false },
    userId: { type: String, required: false, ref: 'User' },
    totalPoint: { type: Number, required: false },
    totalQty: { type: Number, required: false },
    shippingAddress: {
        addressOne: { type: String, required: false },
        addressTwo: { type: String, required: false },
        country: { type: String, required: false },
        state: { type: String, required: false },
        zipCode: { type: String, required: false }
    },
    products: [{
        _id: { type: String, default: '' },
        productId: { type: String, default: '' },
        productName: { type: String, default: '' },
        productImg: { type: String, default: '' },
        unitPoint: { type: Number, default: '' },
        totalPoint: { type: Number, default: '' },
        qty: { type: Number, default: '' }
    }],
    orderStatus: { type: String, enum: ['Accepted', 'Dispatched', 'Shipped', 'Delivered', 'Cancel'], default: 'Accepted' }
}, {
        timestamps: true
    });
module.exports = mongoose.model('Order', orderschema);
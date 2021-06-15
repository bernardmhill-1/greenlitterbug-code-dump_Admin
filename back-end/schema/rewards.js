var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rewardschema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String,required: true},
    ghgreduced: {
        type: Number,
        required: true,
    },
    itemsReduced: {
        type: Number,
        required: true
    },
    pointEarned: {
        type: Number,
        required: true
    },
    totalReward: { type: Number,required: true},
    remainReward: { type: Number,required: true}
}, {
        timestamps: true
    });
module.exports = mongoose.model('Reward', rewardschema);
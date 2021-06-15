var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var userschema = new Schema({
    _id: { type: String, required: true },
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    profile_image: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    phone_no: { type: String, default: '' },
    devicetoken: { type: String, default: '' },
    pushtoken: { type: String, default: '' },
    verification_code: { type: String, default: '' },
    otp: { type: String, default: '' },
    company: { type: String, default: '' },
    apptype: { type: String, enum: ['IOS', 'ANDROID', 'BROWSER'], default: '' },
    status: { type: String, enum: ['yes', 'no'], default: 'yes'},
    email_verify: { type: String, enum: ['yes', 'no'], default: 'no'}
}, {
        timestamps: true
    });
    userschema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
module.exports = mongoose.model('User', userschema);
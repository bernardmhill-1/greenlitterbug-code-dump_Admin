var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

//Create UserSchema
var AdminSchema = new mongoose.Schema({
    _id: { type: String, required: true },
	email: {type: String, required: true, index: {unique : true}},
    password: {type: String, required: true, select: false},
    authtoken: {type: String,default: ''}
},{
    timestamps: true
});

AdminSchema.pre('save', function(next){
    var admin = this;
    if(!admin.isModified('password')) return next();

    bcrypt.hash(admin.password, null, null, function(err, hash){
        if(err){return next(err);}

        admin.password = hash;
        next();
    });
});

AdminSchema.methods.comparePassword = function(password){
    var admin = this;

    return bcrypt.compareSync(password, admin.password);
};


	


// Export your module
module.exports = mongoose.model("Admin", AdminSchema);

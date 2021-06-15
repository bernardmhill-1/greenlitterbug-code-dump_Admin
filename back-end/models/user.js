var UserSchema = require('../schema/users');
var RewardSchema = require('../schema/rewards');
var addToCartSchema = require('../schema/temporaryCarts');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
var async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var fs = require('fs');
var jwt = require('jsonwebtoken');

//create auth token
createToken = (admin) => {
    var tokenData = { id: admin._id };
    var token = jwt.sign(tokenData, secretKey, {
        expiresIn: 86400
    });
    return token;
};

//User Details
var UserModels = {
    /*======== For Admin =======*/
    //User listing
    userList: function (data, callback) {
        if (data) {
            var limit = 10;
            var skip = 0;
            if(data.number){
                limit = parseInt(data.size) * parseInt(data.number);
            }
            
            

            UserSchema.aggregate(
                { $match: { } },
                // {
                //     $skip: skip
                // },
                
                {
                    $sort: {
                      "createdAt": -1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $lookup:
                    {
                        from: 'rewards',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'Reward'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'recycleproducts',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'RecycleProducts'
                    }
                },
                {
                    $project:
                    {
                        first_name: 1,
                        last_name: 1,
                        profile_image: 1,
                        email: 1, phone_no: 1,company: 1,
                        'totalReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.totalReward", 0] },
                                else: 0
                            }
                        },
                        'remainReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.remainReward", 0] },
                                else: 0
                            }
                        },
                        "RecycleProducts": {
                            $cond: {
                                if: { $gt: [{ $size: "$RecycleProducts" }, 0] },
                                then: { $size: "$RecycleProducts" },
                                else: 0
                            }
                        }
                        
                    }
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result.length > 0) {
                            result.map((item) => {
                                if (item.profile_image != null && item.profile_image != '' && item.profile_image != undefined) {
                                    item.image_url = item.profile_image;
                                    item.profile_image = config.liveUrl + item.profile_image;
                                }
                            });
                            
                            callback({
                                "response_code": 2000,
                                "response_message": "User list.",
                                "response_data": result
                            });
                        } else {
                            callback({
                                "response_code": 2000,
                                "response_message": "User list.",
                                "response_data": result
                            });
                        }
                    }
                });
            // UserSchema.find(
            //     {},
            //     { _id: 1, first_name: 1, last_name: 1, email: 1 })
            //     .limit(limit)
            //     .skip(skip)
            //     .exec(function (err, result) {
            //         if (err) {
            //             callback({
            //                 "response_code": 5005,
            //                 "response_message": "INTERNAL DB ERROR",
            //                 "response_data": {}
            //             });
            //         } else {
            //             callback({
            //                 "response_code": 2000,
            //                 "response_message": "User list",
            //                 "response_data": result
            //             });
            //         }
            //     });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    userReport: function (data, callback) {
        if (data) {
            var limit = 10;
            var skip = 0;
            if(data.number){
                limit = parseInt(data.size) * parseInt(data.number);
            }
            
            

            UserSchema.aggregate(
                { $match: { } },
                // {
                //     $skip: skip
                // },
                
                {
                    $sort: {
                      "createdAt": -1
                    }
                },
                
                {
                    $lookup:
                    {
                        from: 'rewards',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'Reward'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'recycleproducts',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'RecycleProducts'
                    }
                },
                {
                    $project:
                    {
                        first_name: 1,
                        last_name: 1,
                        
                        email: 1,
                        'totalReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.totalReward", 0] },
                                else: 0
                            }
                        },
                        'remainReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.remainReward", 0] },
                                else: 0
                            }
                        },
                        "RecycleProducts": {
                            $cond: {
                                if: { $gt: [{ $size: "$RecycleProducts" }, 0] },
                                then: { $size: "$RecycleProducts" },
                                else: 0
                            }
                        }
                        
                    }
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        
                        callback({
                            "response_code": 2000,
                            "response_message": "User list.",
                            "response_data": result
                        });
                    }
                });
            
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    /*======== For Admin =======*/
    //register
    register: function (data, callback) {
        if (data) {
            UserSchema.count(
                { email: data.email }
            ).exec(function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (resCount > 0) {
                        callback({
                            "response_code": 2008,
                            "response_message": "Email address already exist",
                            "response_data": {}
                        });
                    } else {
                        new UserSchema(data).save(function (err, result) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "You have registered successfully.Please verify your email account."
                                });
                            }
                        });
                    }
                }
            });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    //Email Verification 
    emailVerify: function (data, callback) {
        if (data) {
            UserSchema.count(
                { email: data.email }
            ).exec(function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (resCount > 0) {
                        UserSchema.count(
                            { verification_code: data.verification_code }
                        ).exec(function (err, resCount) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (resCount > 0) {
                                    UserSchema.update(
                                        { email: data.email },
                                        {
                                            $set: {
                                                verification_code: '',
                                                email_verify: 'yes'
                                            }
                                        }, function (err, resUpdate) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                callback({
                                                    "response_code": 2000,
                                                    "response_message": "Your account has been activated successfully. You can now login."
                                                });
                                            }
                                        });
                                } else {
                                    callback({
                                        "response_code": 5002,
                                        "response_message": "Verification code is not valid.",
                                        "response_data": {}
                                    });
                                }
                            }
                        });
                    } else {
                        callback({
                            "response_code": 5002,
                            "response_message": "Email address is not valid.",
                            "response_data": {}
                        });
                    }
                }
            });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    // Resend email verification code
    resendEmailVerifyCode: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { email: data.email },
                { first_name: 1, last_name: 1 },
                function (err, findRes) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (findRes != null) {
                            UserSchema.update(
                                { email: data.email },
                                {
                                    $set: {
                                        verification_code: data.verification_code,
                                        email_verify: 'no'
                                    }
                                }, function (err, resUpdate) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Please check your registered email address. We send you verification code.",
                                            "response_data": findRes
                                        });
                                    }
                                });
                        } else {
                            callback({
                                "response_code": 5002,
                                "response_message": "Email address is not valid.",
                                "response_data": {}
                            });
                        }

                    }
                });
        } else {
            callback({
                "response_code": 5002,
                "response_message": "Email address is not valid.",
                "response_data": {}
            });
        }
    },
    //login
    login: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { email: data.email },
                { _id: 1, email: 1, password: 1, email_verify: 1, first_name:1, last_name:1,profile_image: 1 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "Wrong password or email. Please provide registered details.",
                                "response_data": {}
                            });
                        } else {
                            if (result.email_verify == 'no') {
                                callback({
                                    "response_code": 5010,
                                    "response_message": "Your account is not activated. Please activate your account.",
                                    "response_data": {}
                                });
                            } else {
                                var comparePass = bcrypt.compareSync(data.password, result.password);
                                if (comparePass == true) {
                                    var token = createToken(result);
                                    UserSchema.update(
                                        { _id: result._id },
                                        {
                                            $set: {
                                                devicetoken: data.devicetoken,
                                                pushtoken: data.pushtoken,
                                                apptype: data.apptype
                                            }
                                        }, function (err, resUpdate) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                addToCartSchema.aggregate(
                                                    { $match: { userId: result._id } },
                                                    {
                                                        $group:
                                                        {
                                                            _id: null,
                                                            totalQty: { $sum: "$qty" },
                                                            count: { $sum: 1 }
                                                        }
                                                    },
                                                    function (err, countRes) {
                                                        if (err) {
                                                            callback({
                                                                "response_code": 5005,
                                                                "response_message": "INTERNAL DB ERROR",
                                                                "response_data": err
                                                            });
                                                        } else {
                                                            RewardSchema.findOne(
                                                                { user_id: result._id },
                                                                {remainReward:1},
                                                                function(err,rewardRes){
                                                                    if(err){
                                                                        callback({
                                                                            "response_code": 5005,
                                                                            "response_message": "INTERNAL DB ERROR",
                                                                            "response_data": err
                                                                        });
                                                                    }else{
                                                                        if(rewardRes==null){
                                                                            var remainReward = 0;
                                                                        }else{
                                                                            var remainReward = rewardRes.remainReward;
                                                                        }
                                                                        if (countRes.length > 0) {
                                                                            var countQty = countRes[0]['totalQty'];
                                                                        } else {
                                                                            var countQty = 0;
                                                                        }
                                                                        var all_result = {
                                                                            authtoken: token,
                                                                            first_name: result.first_name,
                                                                            last_name: result.last_name,
                                                                            email: result.email,
                                                                            profile_image: result.profile_image,
                                                                            _id: result._id,
                                                                            cartItem: countQty,
                                                                            remainReward:remainReward
                                                                        }
                                                                        callback({
                                                                            "response_code": 2000,
                                                                            "response_message": "Logged your account",
                                                                            "response_data": all_result
                                                                        });
                                                                    }
                                                                });
                                                            
                                                        }
                                                    });
                                            }
                                        });
                                } else {
                                    callback({
                                        "response_code": 5002,
                                        "response_message": "Wrong password or email. Please provide registered details.",
                                        "response_data": {}
                                    });
                                }
                            }
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    //Forgotpassword
    forgotPassword: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { email: data.email },
                { first_name: 1, last_name: 1 },
                function (err, resDetails) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (resDetails == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User does not exist.",
                                "response_data": {}
                            });
                        } else {
                            UserSchema.update(
                                { _id: resDetails._id },
                                {
                                    $set:
                                        { otp: data.otp }
                                }, function (err, result) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Please check your registered email address. We send OTP.",
                                            "response_data": resDetails
                                        });
                                    }
                                });

                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    //OTP Verification 
    verifyOtp: function (data, callback) {
        if (data) {
            UserSchema.count(
                { email: data.email }
            ).exec(function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (resCount > 0) {
                        UserSchema.count(
                            { otp: data.otp }
                        ).exec(function (err, resCount) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (resCount > 0) {
                                    UserSchema.update(
                                        { email: data.email },
                                        {
                                            $set: {
                                                otp: ''
                                            }
                                        }, function (err, resUpdate) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                callback({
                                                    "response_code": 2000,
                                                    "response_message": "You can reset your password."
                                                });
                                            }
                                        });
                                } else {
                                    callback({
                                        "response_code": 5002,
                                        "response_message": "OTP is not valid.",
                                        "response_data": {}
                                    });
                                }
                            }
                        });
                    } else {
                        callback({
                            "response_code": 5002,
                            "response_message": "Email address is not valid.",
                            "response_data": {}
                        });
                    }
                }
            });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    // Reset password
    resetPassword: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { email: data.email },
                { _id: 1 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User does not exist.",
                                "response_data": {}
                            });
                        } else {
                            bcrypt.hash(data.password, null, null, function (err, hash) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    UserSchema.update(
                                        { _id: result._id },
                                        {
                                            $set: { password: hash }
                                        },
                                        function (err, resUpdate) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                callback({
                                                    "response_code": 2000,
                                                    "response_message": "Password has been changed. You can login your account."
                                                });
                                            }
                                        });
                                }
                            });
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    //Profile view
    viewProfile: function (data, callback) {
        if (data) {
            UserSchema.aggregate(
                { $match: { _id: data._id } },
                {
                    $lookup:
                    {
                        from: 'rewards',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'Reward'
                    }
                },
                {
                    $project:
                    {
                        first_name: 1,
                        last_name: 1,
                        profile_image: 1,
                        email: 1, phone_no: 1,company: 1,
                        'totalReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.totalReward", 0] },
                                else: 0
                            }
                        },
                        'remainReward': {
                            $cond: {
                                if: { $gt: [{ $size: "$Reward" }, 0] },
                                then: { "$arrayElemAt": ["$Reward.remainReward", 0] },
                                else: 0
                            }
                        }
                    }
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result.length > 0) {
                            result = result[0];
                            if (result.profile_image != null && result.profile_image != '' && result.profile_image != undefined) {
                                result.image_url = result.profile_image;
                                result.profile_image = config.liveUrl + result.profile_image;
                            }
                            callback({
                                "response_code": 2000,
                                "response_message": "User Profile Details.",
                                "response_data": result
                            });
                        } else {
                            callback({
                                "response_code": 5002,
                                "response_message": "User does not exist",
                                "response_data": {}
                            });
                        }
                    }
                });
        }
    },
    //Update Profile 
    editProfile: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { _id: data._id },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User is not valid.",
                                "response_data": {}
                            });
                        } else {
                            UserSchema.update(
                                { _id: data._id },
                                {
                                    $set: {
                                        first_name: data.first_name,
                                        last_name: data.last_name,
                                        phone_no: data.phone_no,
                                        company: data.company
                                    }
                                }, function (err, resUpdate) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Profile has been updated."
                                        });
                                    }
                                });
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    //Update Profile image
    editProfileImage: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { _id: data._id },
                { profile_image: data.profile_image },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User is not valid.",
                                "response_data": {}
                            });
                        } else {
                            fs.unlink('public/' + result.profile_image, (err) => {
                                if (err) {
                                    console.log('err', err);
                                } else {
                                    console.log('public/' + result.profile_image + ' was deleted');
                                }

                            });
                            UserSchema.update(
                                { _id: data._id },
                                {
                                    $set: {
                                        profile_image: data.profile_image
                                    }
                                }, function (err, resUpdate) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Profile image has been changed.",
                                            "response_data": config.liveUrl + data.profile_image
                                        });
                                    }
                                });
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    // change password
    changePassword: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { _id: data._id },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User does not exist.",
                                "response_data": {}
                            });
                        } else {
                            var comparePass = bcrypt.compareSync(data.currentpassword, result.password);
                            if (comparePass == true) {
                                bcrypt.hash(data.password, null, null, function (err, hash) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        bcrypt.compare(data.password, result.password, function (err, res) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                if (res == false) {
                                                    UserSchema.update(
                                                        { _id: data._id },
                                                        {
                                                            $set: { password: hash }
                                                        },
                                                        function (err, resUpdate) {
                                                            if (err) {
                                                                callback({
                                                                    "response_code": 5005,
                                                                    "response_message": "INTERNAL DB ERROR",
                                                                    "response_data": {}
                                                                });
                                                            } else {
                                                                callback({
                                                                    "response_code": 2000,
                                                                    "response_message": "Password has been changed."
                                                                });
                                                            }
                                                        });
                                                } else {
                                                    callback({
                                                        "response_code": 5002,
                                                        "response_message": "Current password and new password are same.",
                                                        "response_data": {}
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                callback({
                                    "response_code": 5002,
                                    "response_message": "Current password is wrong.",
                                    "response_data": {}
                                });
                            }
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    }
}
module.exports = UserModels;
var mongoose = require("mongoose");
var addToCartSchema = require('../schema/temporaryCarts');
var ProductSchema = require('../schema/products');
var shpiingAddressSchema = require('../schema/shippingAddresses');
var orderSchema = require('../schema/orders');
var RewardSchema = require('../schema/rewards');
var UserSchema = require('../schema/users');
var async = require("async");
var config = require('../config');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var orderid = require('order-id')('mysecret')

var orderModels = {
    addToCart: function (data, callback) {
        if (data) {
            ProductSchema.findOne(
                { _id: data.productId },
                { qty: 1, point: 1 },
                function (err, res) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var productQty = res.qty;
                        if (parseInt(productQty) >= parseInt(data.qty)) {
                            addToCartSchema.findOne(
                                {
                                    userId: data.userId,
                                    productId: data.productId
                                },
                                { qty: 1 },
                                function (er, cartRes) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        if (cartRes == null) {
                                            data._id = new ObjectID;
                                            data.unitPoint = parseInt(res.point);
                                            data.totalPoint = parseInt(data.unitPoint) * parseInt(data.qty);
                                        } else {
                                            data._id = cartRes._id;
                                            data.qty = parseInt(cartRes.qty) + parseInt(data.qty);
                                            data.unitPoint = res.point;
                                            data.totalPoint = parseInt(data.unitPoint) * parseInt(data.qty);
                                        }
                                        addToCartSchema.update(
                                            { _id: data._id },
                                            {
                                                $set: {
                                                    userId: data.userId,
                                                    productId: data.productId,
                                                    qty: data.qty,
                                                    unitPoint: data.unitPoint,
                                                    totalPoint: data.totalPoint
                                                }
                                            },
                                            { upsert: true },
                                            function (err, result) {
                                                if (err) {
                                                    callback({
                                                        "response_code": 5005,
                                                        "response_message": "INTERNAL DB ERROR",
                                                        "response_data": {}
                                                    });
                                                } else {
                                                    addToCartSchema.aggregate(
                                                        { $match: { userId: data.userId } },
                                                        {
                                                            $group:
                                                            {
                                                                _id: null,
                                                                totalQty: { $sum: "$qty" },
                                                                totalPoint: { $sum: "$totalPoint" },
                                                                count: { $sum: 1 }
                                                            }
                                                        },
                                                        function (err, countRes) {
                                                            if (err) {
                                                                callback({
                                                                    "response_code": 5005,
                                                                    "response_message": "INTERNAL DB ERROR",
                                                                    "response_data": {}
                                                                });
                                                            } else {
                                                                if (countRes.length > 0) {
                                                                    var countQty = countRes[0]['totalQty'];
                                                                    var totalPoint = countRes[0]['totalPoint'];
                                                                } else {
                                                                    var countQty = 0;
                                                                    var totalPoint = 0;
                                                                }
                                                                RewardSchema.findOne(
                                                                    { user_id: data.userId },
                                                                    { remainReward: 1 },
                                                                    function (err, pointRes) {
                                                                        if (err) {
                                                                            callback({
                                                                                "response_code": 5005,
                                                                                "response_message": "INTERNAL DB ERROR",
                                                                                "response_data": {}
                                                                            });
                                                                        } else {
                                                                            if (pointRes == null) {
                                                                                var remainReward = 0;
                                                                            } else {
                                                                                var remainReward = pointRes.remainReward;
                                                                            }
                                                                            remainReward = parseInt(parseInt(remainReward) - parseInt(totalPoint));
                                                                            var all_result = {
                                                                                cartItem: countQty,
                                                                                remainReward: remainReward
                                                                            }
                                                                            callback({
                                                                                "response_code": 2000,
                                                                                "response_message": "Product added successfully",
                                                                                "response_data": all_result
                                                                            });
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            }
                                        )
                                    }
                                });

                        } else {
                            callback({
                                "response_code": 5002,
                                "response_message": "Stock is not available",
                                "response_data": {}
                            });
                        }
                    }
                }
            )
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    cartList: function (data, callback) {
        if (data) {
            addToCartSchema.aggregate(
                { $match: { userId: data.userId } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'Product'
                    }
                },
                {
                    $project: {
                        _id: 1, productId: 1, qty: 1, unitPoint: 1, totalPoint: 1,
                        'Product.qty': 1, 'Product.name': 1, 'Product.image': 1
                    }
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        var list = [];
                        var totalPoint = 0;
                        var totalQuantoty = 0;
                        var c = 0;
                        async.forEach(result, function (item, callBack) {
                            if (parseInt(item.Product[0].qty) >= parseInt(item.qty)) {
                                var stock = 'yes';
                            } else {
                                var stock = 'no';
                            }
                            list[c] = {
                                cartId: item._id,
                                productId: item.productId,
                                cartProductQty: item.qty,
                                unitPoint: item.unitPoint,
                                totalPoint: item.totalPoint,
                                productName: item.Product[0].name,
                                productImage: config.liveUrl + item.Product[0].image[0].imageUrl,
                                stockAvl: stock

                            }
                            totalPoint = parseInt(totalPoint + item.totalPoint);
                            totalQuantoty = parseInt(totalQuantoty + item.qty);
                            c++;
                            callBack();
                        }, function (err, content) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Cart list",
                                "response_data": {
                                    list: list,
                                    totalPoint: totalPoint,
                                    totalQuantoty: totalQuantoty
                                }
                            });
                        });

                    }
                }
            )
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    cartQuatityUpdate: function (data, callback) {
        if (data) {
            async.waterfall([
                function (nextCb) {
                    RewardSchema.findOne(
                        { user_id: data.userId },
                        { remainReward: 1 },
                        function (err, result) {
                            if (err) {
                                nextCb(null, {
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (result == null) {
                                    var remainReward = 0;
                                } else {
                                    var remainReward = result.remainReward;
                                }
                                nextCb(null, {
                                    "response_code": 2000,
                                    "response_message": "remain reward",
                                    "response_data": remainReward
                                });
                            }
                        }
                    )
                }, function (arg1, nextCb) {
                    if (arg1.response_code == 2000) {
                        addToCartSchema.find(
                            {
                                userId: data.userId,
                                _id: { $ne: data.cartId }
                            },
                            {
                                _id: 1, qty: 1, unitPoint: 1, totalPoint: 1
                            },
                            function (err, result) {
                                if (err) {
                                    nextCb(null, {
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    if (result == 0) {
                                        var totalPoint = 0;
                                        nextCb(null, {
                                            "response_code": 2000,
                                            "response_message": "Result",
                                            "response_data": {
                                                remainReward: arg1.response_data,
                                                totalPoint: totalPoint
                                            }
                                        });
                                    } else {
                                        var totalPoint = 0;
                                        async.forEach(result, function (item, callBack) {
                                            totalPoint = parseInt(totalPoint + item.totalPoint);
                                            callBack();
                                        }, function (err, req) {
                                            if (err) {
                                                nextCb(null, {
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                nextCb(null, {
                                                    "response_code": 2000,
                                                    "response_message": "Result",
                                                    "response_data": {
                                                        remainReward: arg1.response_data,
                                                        totalPoint: totalPoint
                                                    }
                                                });
                                            }
                                        });
                                    }

                                }
                            });
                    } else {
                        nextCb(null, arg1);
                    }
                }, function (arg1, nextCb) {
                    if (arg1.response_code == 2000) {
                        var remainReward = arg1.response_data.remainReward;
                        var totalPoint = arg1.response_data.totalPoint;
                        addToCartSchema.findOne(
                            { _id: data.cartId },
                            { unitPoint: 1 },
                            function (err, findRes) {
                                data.totalPoint = parseInt(findRes.unitPoint) * parseInt(data.qty);
                                var allTotalPoint = parseInt(data.totalPoint) + parseInt(totalPoint);
                                if (allTotalPoint <= remainReward) {
                                    addToCartSchema.update(
                                        { _id: data.cartId },
                                        {
                                            $set: {
                                                qty: data.qty,
                                                totalPoint: data.totalPoint
                                            }
                                        },
                                        function (err, result) {
                                            if (err) {
                                                nextCb(null, {
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": err
                                                });
                                            } else {
                                                addToCartSchema.aggregate(
                                                    { $match: { userId: data.userId } },
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
                                                            nextCb(null, {
                                                                "response_code": 5005,
                                                                "response_message": "INTERNAL DB ERROR",
                                                                "response_data": {}
                                                            });
                                                        } else {
                                                            remainReward = parseInt(parseInt(remainReward) - parseInt(allTotalPoint));
                                                            if (countRes.length > 0) {
                                                                var countQty = countRes[0]['totalQty'];
                                                            } else {
                                                                var countQty = 0;
                                                            }
                                                            var all_result = {
                                                                cartItem: countQty,
                                                                remainReward: remainReward
                                                            }
                                                            nextCb(null, {
                                                                "response_code": 2000,
                                                                "response_message": "Quantity updated",
                                                                "response_data": all_result
                                                            });
                                                        }
                                                    });
                                            }
                                        });
                                } else {
                                    nextCb(null, {
                                        "response_code": 5002,
                                        "response_message": "You have no sufficient point",
                                        "response_data": {}
                                    });
                                }
                            });
                    } else {
                        nextCb(null, arg1);
                    }
                }
            ], function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(result);
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
    cartProductDelete: function (data, callback) {
        if (data) {
            addToCartSchema.findOneAndRemove(
                { _id: data.cartId },
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
                                "response_message": "No record found",
                                "response_data": {}
                            });
                        } else {
                            addToCartSchema.aggregate(
                                { $match: { userId: data.userId } },
                                {
                                    $group:
                                    {
                                        _id: null,
                                        totalQty: { $sum: "$qty" },
                                        totalPoint: { $sum: "$totalPoint" },
                                        count: { $sum: 1 }
                                    }
                                },
                                function (err, countRes) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        if (countRes.length > 0) {
                                            var countQty = countRes[0]['totalQty'];
                                            var totalPoint = countRes[0]['totalPoint'];
                                        } else {
                                            var countQty = 0;
                                            var totalPoint = 0;
                                        }
                                        RewardSchema.findOne(
                                            { user_id: data.userId },
                                            { remainReward: 1 },
                                            function (err, pointRes) {
                                                if (err) {
                                                    callback({
                                                        "response_code": 5005,
                                                        "response_message": "INTERNAL DB ERROR",
                                                        "response_data": {}
                                                    });
                                                } else {
                                                    if (pointRes == null) {
                                                        var remainReward = 0;
                                                    } else {
                                                        var remainReward = pointRes.remainReward;
                                                    }
                                                    remainReward = parseInt(parseInt(remainReward) - parseInt(totalPoint));
                                                    var all_result = {
                                                        cartItem: countQty,
                                                        remainReward: remainReward
                                                    }
                                                    callback({
                                                        "response_code": 2000,
                                                        "response_message": "Product deleted from cart",
                                                        "response_data": all_result
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
    addShippingAddress: function (data, callback) {
        if (data) {
            shpiingAddressSchema.findOne(
                { userId: data.userId },
                { _id: 1 },
                function (err, countRes) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (countRes == null) {
                            data._id = new ObjectID;
                        } else {
                            data._id = countRes['_id'];
                        }
                        shpiingAddressSchema.update(
                            { userId: data.userId },
                            {
                                $set: {
                                    userId: data.userId,
                                    addressOne: data.addressOne,
                                    addressTwo: data.addressTwo,
                                    country: data.country,
                                    state: data.state,
                                    zipCode: data.zipCode
                                }
                            },
                            { upsert: true },
                            function (err, updateData) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Shipping address added successfully",
                                        "response_data": {
                                            _id: countRes['_id'],
                                            userId: data.userId,
                                            addressOne: data.addressOne,
                                            addressTwo: data.addressTwo,
                                            country: data.country,
                                            state: data.state,
                                            zipCode: data.zipCode

                                        }
                                    });
                                }
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
    viewShippingAddress: function (data, callback) {
        shpiingAddressSchema.findOne(
            { userId: data.userId },
            { _id: 1, userId: 1, addressOne: 1, addressTwo: 1, country: 1, state: 1, zipCode: 1 },
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
                        "response_message": "Shipping address Details",
                        "response_data": result
                    });
                }
            });
    },
    checkOut: function (data, callback) {
        if (data) {
            this.cartList(data, function (list) {
                if (list.response_code == 2000) {
                    if (list.response_data.list.length > 0) {
                        var QtyChk = 0;
                        var productId = [];
                        var exsitNotProductId = [];
                        var products = [];
                        var p = 0;
                        var totalPoint = 0;
                        var totalQty = 0;
                        async.forEach(list.response_data.list, function (item, callBack) {
                            ProductSchema.findOne(
                                { _id: item.productId },
                                { qty: 1 },
                                function (err, chkRes) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        if (chkRes == null) {
                                            exsitNotProductId.push(item.productId);
                                        } else {
                                            if (item.cartProductQty > chkRes.qty) {
                                                productId.push(item.productId);
                                            } else {
                                                products[p] = {
                                                    _id: new ObjectID,
                                                    productId: item.productId,
                                                    productName: item.productName,
                                                    productImg: item.productImage,
                                                    unitPoint: item.unitPoint,
                                                    totalPoint: item.totalPoint,
                                                    qty: item.cartProductQty
                                                }
                                                totalPoint = parseInt(totalPoint) + parseInt(item.totalPoint);
                                                totalQty = parseInt(totalQty) + parseInt(item.cartProductQty);
                                                p++;
                                            }
                                        }
                                        callBack();
                                    }
                                });
                        }, function (err, listRes) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (productId.length > 0) {
                                    callback({
                                        "response_code": 2012,
                                        "response_message": "Product stock is not available",
                                        "response_data": productId
                                    });
                                } else if (exsitNotProductId.length > 0) {
                                    callback({
                                        "response_code": 2012,
                                        "response_message": "Product does not exist",
                                        "response_data": exsitNotProductId
                                    });
                                } else {
                                    RewardSchema.findOne(
                                        { user_id: data.userId },
                                        { remainReward: 1 },
                                        function (err, rewardRes) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                if (rewardRes == null) {
                                                    callback({
                                                        "response_code": 2020,
                                                        "response_message": "You have no sufficient point",
                                                        "response_data": {}
                                                    });
                                                } else if (rewardRes.remainReward < totalPoint) {
                                                    callback({
                                                        "response_code": 2020,
                                                        "response_message": "You have no sufficient point",
                                                        "response_data": {}
                                                    });
                                                } else {
                                                    shpiingAddressSchema.findOne(
                                                        { userId: data.userId },
                                                        { _id: 0, addressOne: 1, addressTwo: 1, country: 1, state: 1, zipCode: 1 },
                                                        function (err, addRes) {
                                                            if (err) {
                                                                callback({
                                                                    "response_code": 5005,
                                                                    "response_message": "INTERNAL DB ERROR",
                                                                    "response_data": {}
                                                                });
                                                            } else {
                                                                var newData = {
                                                                    _id: new ObjectID,
                                                                    orderId: orderid.generate(),
                                                                    totalPoint: totalPoint,
                                                                    totalQty: totalQty,
                                                                    userId: data.userId,
                                                                    shippingAddress: addRes,
                                                                    products: products
                                                                }

                                                                new orderSchema(newData).save(function (err, result) {
                                                                    if (err) {
                                                                        callback({
                                                                            "response_code": 5005,
                                                                            "response_message": "INTERNAL DB ERROR",
                                                                            "response_data": err
                                                                        });
                                                                    } else {
                                                                        addToCartSchema.remove(data, function (err, restult) {
                                                                            if (err) {
                                                                                callback({
                                                                                    "response_code": 5005,
                                                                                    "response_message": "INTERNAL DB ERROR",
                                                                                    "response_data": err
                                                                                });
                                                                            } else {
                                                                                var remainPoint = parseInt(rewardRes.remainReward) - parseInt(totalPoint);
                                                                                RewardSchema.update(
                                                                                    { user_id: data.userId },
                                                                                    {
                                                                                        $set: {
                                                                                            remainReward: remainPoint
                                                                                        }
                                                                                    },
                                                                                    function (err, dataUpdate) {
                                                                                        if (err) {
                                                                                            callback({
                                                                                                "response_code": 5005,
                                                                                                "response_message": "INTERNAL DB ERROR",
                                                                                                "response_data": err
                                                                                            });
                                                                                        } else {
                                                                                            async.forEach(products, function (proItem, callBack) {
                                                                                                ProductSchema.update(
                                                                                                    {
                                                                                                        _id: proItem.productId
                                                                                                    },
                                                                                                    { $inc: { qty: -proItem.qty } },
                                                                                                    function (err, updateRes) {
                                                                                                        callBack();
                                                                                                    });
                                                                                            }, function (err, content) {
                                                                                                UserSchema.findOne(
                                                                                                    {_id:data.userId},
                                                                                                    {pushtoken:1},
                                                                                                    function(err,userRes){
                                                                                                        if(err){
                                                                                                            callback({
                                                                                                                "response_code": 5005,
                                                                                                                "response_message": "INTERNAL DB ERROR",
                                                                                                                "response_data": err
                                                                                                            });
                                                                                                        }else{
                                                                                                            callback({
                                                                                                                "response_code": 2000,
                                                                                                                "response_message": "Order is placed",
                                                                                                                "response_data": {
                                                                                                                    orderId: newData.orderId,
                                                                                                                    pushtoken:userRes.pushtoken,
                                                                                                                    remainReward:remainPoint
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                
                                                                                            })

                                                                                        }
                                                                                    });
                                                                            }

                                                                        })

                                                                    }
                                                                });
                                                            }
                                                        });
                                                }
                                            }
                                        });

                                }
                            }

                        });
                    } else {
                        callback({
                            "response_code": 2010,
                            "response_message": "Cart is empty",
                            "response_data": {}
                        });
                    }
                } else {
                    callback({
                        "response_code": list.response_code,
                        "response_message": list.response_message,
                        "response_data": list.response_data
                    });
                }
            });
        } else {
            callback({
                "response_code": 2000,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    orderList: function (data, callback) {
        if (data) {
            orderSchema.find(
                { userId: data.userId },
                {
                    _id: 1,
                    orderId: 1,
                    totalPoint: 1,
                    totalQty: 1,
                    shippingAddress: 1,
                    products: 1,
                    orderStatus: 1,
                    createdAt: 1
                },
                {sort: {createdAt: -1}},
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 2000,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (result.length > 0) {
                            async.forEach(result, function (item, callBack) {
                                async.forEach(item.products, function (proItem, callback) {
                                    proItem.productImg=config.liveUrl+proItem.productImg;
                                    callback();
                                }, function (err, list) {

                                });
                                callBack();
                            }, function (err, cotent) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Order list",
                                    "response_data": result
                                });
                            });
                        }else{
                            callback({
                                "response_code": 2000,
                                "response_message": "Order list",
                                "response_data": {}
                            });
                        }
                        
                    }
                }
            )
        } else {
            callback({
                "response_code": 2000,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    orderListModel: function (data, callback) {
        var limit = parseInt(data.size) + parseInt(data.number);
        var skip = 0;
        if (data) {
            orderSchema.find(
                { },
                {
                    _id: 1,
                    orderId: 1,
                    totalPoint: 1,
                    totalQty: 1,
                    shippingAddress: 1,
                    products: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    userId: 1
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 2000,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        //console.log('result', result);
                        if (result.length > 0) {
                            async.forEach(result, function (item, callBack) {
                                //console.log('item',item);
                                async.forEach(item.products, function (proItem, callback) {
                                    // proItem.productImg=config.liveUrl+proItem.productImg;
                                    callback();
                                }, function (err, list) {

                                });
                                callBack();
                            }, function (err, cotent) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Order list",
                                    "response_data": result
                                });
                            });
                        }else{
                            callback({
                                "response_code": 2000,
                                "response_message": "Order list",
                                "response_data": {}
                            });
                        }
                        
                    }
                }
            )
            .populate('userId', 'first_name last_name email')
            .limit(limit).skip(skip)
        } else {
            callback({
                "response_code": 2000,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    changeOrderStatus: function (data, callback) {
        orderSchema.count(
            { _id: data._id },
            function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (resCount == 0) {
                        callback({
                            "response_code": 5002,
                            "response_message": "No data found",
                            "response_data": {}
                        });
                    } else {
                        orderSchema.update(
                            { _id: data._id },
                            { $set: { orderStatus: data.orderStatus } },
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
                                        "response_message": "Data updated successfully.",
                                        "response_data": {}
                                    });
                                }
                            }
                        )
                    }
                }
            }
        )
    },

}
module.exports = orderModels;
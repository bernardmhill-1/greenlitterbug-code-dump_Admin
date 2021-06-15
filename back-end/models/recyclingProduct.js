var mongoose = require("mongoose");
var RecycleProductSchema = require('../schema/recycleProducts');
var RecycleProductTypeSchema = require('../schema/recycleProductTypes');
var RecycleProductScanMsgSchema = require('../schema/recycleproductScanMsg');
var RewardSchema = require('../schema/rewards');
var UserSchema = require('../schema/users');
var async = require("async");
var config = require('../config');

var RecyclingProductModels = {
    recyclingProductTypeAdd: function (data, callback) {
        if (data) {
            new RecycleProductTypeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Data added successfully.",
                        "response_data": {}
                    });
                }
            })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductTypeList: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            RecycleProductTypeSchema.find(
                {})
                .limit(limit)
                .skip(skip)
                .sort({ "productTypeName": 1 })
                .exec(function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product type list",
                            "response_data": result
                        });
                    }
                });
        } else {
            RecycleProductTypeSchema.find()
                .sort({ "productTypeName": 1 })
                .exec(function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product type list",
                            "response_data": result
                        });
                    }
                });
        }
    },
    recyclingProductTypeEdit: async function (data, callback) {
        if (data) {

            let pType = await RecycleProductTypeSchema.findOne({
                _id: data._id
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            });

            if(pType == null){

                callback({
                    "response_code": 404,
                    "response_message": "Type not exist.",
                    "response_data": {}
                });

                return;
            }

            RecycleProductTypeSchema.update(
                { _id: data._id },
                {
                    $set:
                        { 
                            ...(( data.productTypeName)   ? { productTypeName : data.productTypeName }   : pType.productTypeName),
                            ...(( data.weight)    ? { weight : data.weight }   : pType.weight),
                           
                        }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Data updated successfully.",
                            "response_data": {}
                        });
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductTypeDelete: function (data, callback) {
        if (data) {
            RecycleProductSchema.count(
                { productType: data._id },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (resCount == 0) {
                            RecycleProductTypeSchema.remove(
                                { _id: data._id },
                                function (err, result) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": err
                                        });
                                    } else {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Data deleted successfully.",
                                            "response_data": {}
                                        });
                                    }
                                }
                            )
                        } else {
                            callback({
                                "response_code": 5002,
                                "response_message": "Atfirst delete related product of this type.",
                                "response_data": err
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
    ////// Dibyendu /////
    recyclingProductScanMsgAdd: async function (data, callback) {
        if (data) {

            let msg = await RecycleProductScanMsgSchema.findOne({
                productType: data.productType,
                number: data.number
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            });

            if(msg != null){

                callback({
                    "response_code": 404,
                    "response_message": "Message already added.",
                    "response_data": {}
                });

                return;
            }
            new RecycleProductScanMsgSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Data added successfully.",
                        "response_data": {}
                    });
                }
            })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductScanMsgList: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            var query = {};
            if (data._id) {
                query['_id'] = data._id;
            }
            if (data.productType) {
                query['productType'] = data.productType;
            }
            if (data.number) {
                query['number'] = data.number;
            }
            RecycleProductScanMsgSchema.find(
                query)
                .limit(limit)
                .skip(skip)
                .sort({ "number": 1 })
                .exec(function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product message list",
                            "response_data": result
                        });
                    }
                });
        } else {
            RecycleProductScanMsgSchema.find()
                .sort({ "number": 1 })
                .exec(function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product message list",
                            "response_data": result
                        });
                    }
                });
        }
    },
    recyclingProductScanMsgEdit: async function (data, callback) {
        if (data) {

            let msg = await RecycleProductScanMsgSchema.findOne({
                _id: data._id
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            });

            if(msg == null){

                callback({
                    "response_code": 404,
                    "response_message": "Message not exist.",
                    "response_data": {}
                });

                return;
            }

            RecycleProductScanMsgSchema.update(
                { _id: data._id },
                {
                    $set:
                        { 
                            ...(( data.message)   ? { message : data.message }   : pType.message)
                           
                        }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Data updated successfully.",
                            "response_data": {}
                        });
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductScanMsgDelete: function (data, callback) {
        if (data) {
            RecycleProductScanMsgSchema.remove(
                { _id: data._id },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Data deleted successfully.",
                            "response_data": {}
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
    ///// Dibyendu /////
    recyclingProductListForAdmin: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            var query = {};
            var sortBy = { "createdAt": -1 }; 

            if (data.user_id == 'all') {
                query = {}
            } else {
                query["user_id"] = data.user_id;
            }

            if(data.sortBy){
                if(data.sortBy == "asc"){
                    sortBy = { "createdAt": 1 };
                } else if(data.sortBy == "desc"){
                    sortBy = { "createdAt": -1 };
                } else if(data.sortBy == "company"){
                    sortBy = { "companyName": 1 };
                }
                
            }

            if(data.name) {
                query["companyName"] = new RegExp(data.name, 'i');
            }
            
            RecycleProductSchema.find(
                query)
                .limit(limit)
                .skip(skip)
                .sort(sortBy)
                .exec(function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        async.forEach(result, function (item, callBack) {
                            if (item.productImage != undefined && item.productImage != '' && item.productImage != null) {
                                item.productImage = config.liveUrl + item.productImage;
                            } else {
                                item.productImage = config.liveUrl + 'uploads/no-img.jpg';
                            }
                            callBack();
                        }, function (err, list) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Recycling product list",
                                    "response_data": result
                                });
                            }
                        })
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductDetails: function (data, callback) {
        if (data) {
            RecycleProductSchema.aggregate(
                { $match: { _id: data._id } },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "User"
                    }
                },
                {
                    $lookup:
                    {
                        from: "recycleproducttypes",
                        localField: "productType",
                        foreignField: "_id",
                        as: "RecyclingProductType"
                    }
                },
                {
                    $project: {
                        companyName: 1,
                        productImage: 1,
                        barCode: 1,
                        binCode: 1, reward: 1, place: 1, user_id: 1, productType: 1,
                        'User.first_name': 1, 'User.last_name': 1, 'User.email': 1,
                        'RecyclingProductType.productTypeName': 1
                    }
                }, function (err, results) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        results = results[0];
                        results.User = results.User[0];
                        if (results.productImage != undefined && results.productImage != '' && results.productImage != null) {
                            results.productImage = config.liveUrl + results.productImage;
                        } else {
                            results.productImage = config.liveUrl + 'uploads/no-img.jpg';
                        }
                        if (results.barCodeImage != undefined && results.barCodeImage != '' && results.barCodeImage != null) {
                            results.barCodeImage = config.liveUrl + results.barCodeImage;
                        } else {
                            results.barCodeImage = config.liveUrl + 'uploads/no-img.jpg';
                        }
                        results.RecyclingProductType = results.RecyclingProductType[0].productTypeName;
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product details",
                            "response_data": results
                        });
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductAdd: function (data, callback) {
        if (data) {
            new RecycleProductSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    RecycleProductSchema.count(
                        {
                            productType: data.productType,
                            user_id: data.user_id
                        },
                        function (err, resCount) {
                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Data added successfully.",
                                    "response_data": resCount
                                });
                            }
                        })
                    // callback({
                    //     "response_code": 2000,
                    //     "response_message": "Data added successfully.",
                    //     "response_data": {}
                    // });
                }
            })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductCheck: function (data, callback) {
        if (data) {
            RecycleProductSchema.count(
                {
                    barCode: data.barCode,
                    user_id: data.user_id,
                    addStatus: 'no'
                },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling Product",
                            "response_data": resCount
                        });
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductListByUser: function (data, callback) {
        if (data) {
            RecycleProductSchema.find(
                { user_id: data.user_id },
                { __v: 0, updatedAt: 0 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if(result.length > 0){

                            async.forEach(result, function (item, callBack) {
                                if (item.productImage != undefined && item.productImage != '' && item.productImage != null) {
                                    item.productImage = config.liveUrl + item.productImage;
                                }
                                if (item.barCodeImage != undefined && item.barCodeImage != '' && item.barCodeImage != null) {
                                    item.barCodeImage = config.liveUrl + item.barCodeImage;
                                }
                                callBack();
                            }, function (err, list) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Recycling product list",
                                        "response_data": result
                                    });
                                }
                            })

                        } else {
                            callback({
                                "response_code": 2000,
                                "response_message": "Recycling product list",
                                "response_data": result
                            });
                        }
                        
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    recyclingProductBarChart: async function (data, callback) {
        if (data) {
            var labels = [],
                productTypes = [],
                barChartData = [];
            let pTypes = await RecycleProductTypeSchema.find({
                
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            }).sort({
                productTypeName: 1
            });

            if(pTypes.length > 0){
                pTypes.map(item => {
                    labels.push(item.productTypeName);
                });
            }
            labels.push("Company")

            let recycleProducts = await RecycleProductSchema.find({
                user_id: data.user_id
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            });

            if(recycleProducts.length > 0){
                
               
                recycleProducts.map(item => {
                    productTypes.push(item.productType);
                });
                
                var count = {};
                productTypes.forEach(function(i) { count[i] = (count[i]||0) + 1;});

                if(pTypes.length > 0){
                    pTypes.map(type => {
                        
                        if(type._id in count){
                            barChartData.push(count[type._id])
                        } else {
                            barChartData.push(0)
                        }


                    });
                }
                
                const distinctComp = await RecycleProductSchema.distinct("companyName", {
                    user_id: data.user_id
                });

                barChartData.push(distinctComp.length);

            } else {

                labels.map(item => {
                    barChartData.push(0);
                });
            }
            
            
            

            callback({
                "response_code": 2000,
                "response_message": "Recycling product Chart",
                "response_data": {
                    labels: labels,
                    datasets: [{
                      data: barChartData
                    }]
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
    recyclingProductPieChart: async function (data, callback) {
        if (data) {
            var graph1 = [
                { name: 'Enduser', quantity: 0, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { name: 'Company', quantity: 0, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 }
              ]
            var graph2 = [],
                productTypes = [],
                colors = ['#e66149','#e66349','#e66849','#e67549','#e69249','#e6a749','#e6c149','#e6e349','#afe649','#7be649'],
                barChartData = [];
            let pTypes = await RecycleProductTypeSchema.find({
                
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            }).sort({
                productTypeName: 1
            });

            if(pTypes.length > 0){
                pTypes.map((item, index) => {
                    console.log("colors[index]",colors[index]);
                    graph2.push({
                        name: item.productTypeName,
                        quantity: 0,
                        legendFontColor: '#7F7F7F', 
                        legendFontSize: 15,
                        color: colors[index]
                    });
                });
            }
            

            let recycleProducts = await RecycleProductSchema.find({
                user_id: data.user_id
            }, function (err, result) {
                if (err) {
                    callback({
                
                        response_code: 5005,
                        response_message: "INTERNAL DB ERROR",
                        response: {}
                    });
    
                }
            });

            if(recycleProducts.length > 0){
                
               
                recycleProducts.map(item => {
                    productTypes.push(item.productType);
                });
                // let unique = [...new Set(productTypes)];
                // unique.map(value => {
                    
                //     duplicates.push({
                //         typeID: value,
                //         quantity:productTypes.filter(str => str === value).length
                //     })
                    
                    
                // });
                var count = {};
                productTypes.forEach(function(i) { count[i] = (count[i]||0) + 1;});

                if(pTypes.length > 0){
                    pTypes.map(type => {
                        
                        if(type._id in count){
                            barChartData.push(count[type._id])
                        } else {
                            barChartData.push(0)
                        }


                    });
                }
                
                const distinctComp = await RecycleProductSchema.distinct("companyName", {
                    user_id: data.user_id
                });
                const distinctUser = await RecycleProductSchema.distinct("user_id");

                graph1[0].quantity = distinctUser.length;
                graph1[1].quantity = distinctComp.length;

                graph2.map((item,index) => {
                    item.quantity = barChartData[index];
                });

            } else {

                labels.map(item => {
                    barChartData.push(0);
                });
            }
            
            
            

            callback({
                "response_code": 2000,
                "response_message": "Recycling product Chart",
                "response_data": {
                    "graph1" : graph1,
                    "graph2": graph2
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
    totalrecyclingProductByUser: async function (data, callback) {
        if (data) {
            var productTypes = [];
            var totalWeight = 0;
            RecycleProductSchema.find(
                { user_id: data.user_id },
                { __v: 0, updatedAt: 0 },
                async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if(result.length > 0){
                            var duplicates = [];
                            var weight = [];
                           
                            result.map(item => {
                                productTypes.push(item.productType);
                            });
                            let unique = [...new Set(productTypes)];
                            unique.map(value => {
                                
                                duplicates.push({
                                    typeID: value,
                                    quantity:productTypes.filter(str => str === value).length
                                })
                                
                            });

                            for(i=0; i < duplicates.length; i++){ 

                                var typeID = duplicates[i].typeID;
                                var quantity = duplicates[i].quantity;

                                let pType = await RecycleProductTypeSchema.findOne({
                                    _id: typeID
                                }, function (err, result) {
                                    if (err) {
                                        callback({
                                    
                                            response_code: 5005,
                                            response_message: "INTERNAL DB ERROR",
                                            response: {}
                                        });
                        
                                    }
                                });
                                
                                if(pType != null){
                                    
                                    weight.push(pType.weight * quantity);
                                }
                            };
                            totalWeight = weight.reduce(function(a, b){
                                return a + b;
                            }, 0);
                            
                            
                        }

                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product list",
                            "response_data": totalWeight
                        });
                    }
                })
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    rewadAdd: function (data, callback) {
        if (data) {
            RewardSchema.update(
                { user_id: data.user_id },
                { $inc: { totalReward: 5, remainReward: 5 } },
                { upsert: true },
                function (err, dataRes) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        RewardSchema.findOne(
                            { user_id: data.user_id },
                            { remainReward: 1 },
                            function (err, pointRes) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    UserSchema.findOne(
                                        { _id: data.user_id },
                                        { pushtoken: 1 },
                                        function (err, userRes) {
                                            if (err) {
                                                callback({
                                                    "response_code": 5005,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": err
                                                });
                                            } else {
                                                callback({
                                                    "response_code": 2000,
                                                    "response_message": "Reward details",
                                                    "response_data": {
                                                        remainReward: pointRes.remainReward,
                                                        pushtoken: userRes.pushtoken
                                                    }
                                                });
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
    totalRewardByUser: function (data, callback) {
        if (data) {
            RewardSchema.findOne(
                { user_id: data.user_id },
                { _id: 0, totalReward: 1, remainReward: 1 },
                function (err, result) {
                    if (result != null) {
                        var totalReward = result.totalReward;
                        var remainReward = result.remainReward;
                    } else {
                        var totalReward = 0;
                        var remainReward = 0;
                    }
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Recycling product total reward",
                            "response_data": {
                                totalReward: totalReward,
                                remainReward: remainReward
                            }
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
    UpdateStatusRecyclingProduct: function (callback) {
        var checkTIme = 3600000;
        //var checkTIme = 60000;
        RecycleProductSchema.aggregate(
            {
                $project: {
                    _id: 1,
                    "timestamp": { $subtract: [new Date(),"$createdAt"] }
                }
                
            },
            {
                $match:{
                    timestamp: { $gte: checkTIme }
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
                    async.forEach(result, function (item, callBack) {
                        RecycleProductSchema.update(
                            { _id: item._id },
                            { $set: { addStatus: 'yes' } },
                            function(err,resUpdate){

                            });
                        callBack();
                    }, function (err, list) {
                        if (err) {
                            callback({
                                "response_code": 5005,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            callback({
                                "response_code": 2000,
                                "response_message": "Updated",
                                "response_data": result
                            });
                        }
                    })
                }
            })


    }

}
module.exports = RecyclingProductModels;
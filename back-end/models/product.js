var mongoose = require("mongoose");
var ProductCategorySchema = require('../schema/productCategories');
var ProductSchema = require('../schema/products');
var async = require("async");
var config = require('../config');
var fs = require('fs');

var productModels = {
    productCategoryAdd: function (data, callback) {
        if (data) {
            new ProductCategorySchema(data).save(function (err, result) {
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
    productCategoryEdit: function (data, callback) {
        if (data) {
            ProductCategorySchema.update(
                { _id: data._id },
                {
                    $set:
                        { category: data.category }
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
    productCategoryDelete: function (data, callback) {
        if (data) {
            ProductSchema.count(
                { category: data._id },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (resCount == 0) {
                            ProductCategorySchema.remove(
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
                                "response_message": "Atfirst delete related product of this category.",
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
    productCategoryList: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            ProductCategorySchema.find(
                {})
                .limit(limit)
                .skip(skip)
                .sort({ "category": 1, "_id": 1 })
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
                            "response_message": "Product category list",
                            "response_data": result
                        });
                    }
                });
        } else {
            ProductCategorySchema
                .find(
                    { _id: { $ne: null } },
                    { _id: 1, category: 1 }
                )
                .sort({ "category": 1 })
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
                            "response_message": "Product category list",
                            "response_data": result
                        });
                    }
                });
        }
    },
    addProduct: function (data, callback) {
        if (data) {
            new ProductSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Product added successfully.",
                        "response_data": {}
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
    setPopularProduct: function (data, callback) {
        ProductSchema.count(
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
                        ProductSchema.update(
                            { _id: data._id },
                            { $set: { isPopular: data.isPopular } },
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
    productListForAdmin: function (data, callback) {
        var limit = parseInt(data.size) + parseInt(data.number);
        var skip = 0;
        ProductSchema.aggregate(
            { $project: { _id: 1, name: 1, image: 1, qty: 1, point: 1, isPopular: 1, category: 1, vendor: 1 } },
            { $sort: { name: 1 } },
            { $limit: limit },
            { $skip: skip },
            function (err, result) {
                if (err) {
                    callback(null, {
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    async.forEach(result, function (item, callback) {
                        item.image = config.liveUrl + item.image[0].imageUrl;
                        callback();
                    }, function (err, list) {
                        callback({
                            "response_code": 2000,
                            "response_message": "Product list.",
                            "response_data": result
                        });
                    });
                }
            });
    },
    productDelete: function (data, callback) {
        if (data) {
            ProductSchema.count(
                { _id: data._id },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (resCount > 0) {
                            ProductSchema.remove(
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
                                "response_message": "Data not found.",
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
    productList: function (data, callback) {
        var condition = [];
        condition = [{ qty: { $ne: 0 } }];
        if (data.searchKey != undefined && data.searchKey != null && data.searchKey != '') {
            condition.push({ name: { $regex: data.searchKey, $options: 'i' } });
        }
        if (data.category != undefined && data.category != null && data.category != '') {
            condition.push({ category: data.category });
        }
        async.parallel({
            totalPage: function (callback) {
                ProductSchema.aggregate(
                    { $match: { $and: condition } },
                    { $count: "total_product" },
                    function (err, result) {
                        if (err) {
                            callback(null, {
                                "response_code": 5005,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            if (result.length > 0) {
                                var total_product = result[0]['total_product'];
                                if (total_product != undefined && total_product != null && total_product != '') {
                                    if (total_product > config.limit) {
                                        var total_page = Math.ceil(total_product / config.limit);
                                        callback(null, total_page);
                                    } else {
                                        var total_page = 1;
                                        callback(null, total_page);
                                    }
                                }
                            } else {
                                callback(null, 0);
                            }

                        }
                    });
            },
            productList: function (callback) {
                if (data.page_no != undefined && data.page_no != '' && data.page_no != null && data.page_no != 0) {
                    var limit = config.limit;
                    var skip = parseInt((parseInt(data.page_no) - 1) * limit);
                } else {
                    var limit = 0;
                    var skip = 0;
                }
                ProductSchema.aggregate(
                    { $match: { $and: condition } },
                    { $project: { _id: 1, name: 1, image: 1, qty: 1, point: 1 } },
                    { $sort: { name: 1 } },
                    { $limit: skip + limit },
                    { $skip: skip },
                    function (err, result) {
                        if (err) {
                            callback(null, {
                                "response_code": 5005,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": err
                            });
                        } else {
                            async.forEach(result, function (item, callback) {
                                item.image = config.liveUrl + item.image[0].imageUrl;
                                callback();
                            }, function (err, list) {
                                callback(null, result);
                            });
                        }
                    });
            }
        }, function (err, content) {
            if (err) {
                callback({
                    "response_code": 5005,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 2000,
                    "response_message": "Product list.",
                    "response_data": {
                        productList: content.productList,
                        totalPage: content.totalPage
                    }
                });
            }
        });


    },
    productDetail: function (data, callback) {
        if (data) {
            ProductSchema.findOne(
                { _id: data._id },
                { _id: 1, name: 1, description: 1, image: 1, qty: 1, point: 1, category: 1, vendor: 1 },
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
                                "response_message": "No data found",
                                "response_data": {}
                            });
                        } else {
                            async.forEach(result.image, function (imgItm, callback) {
                                imgItm.imageUrl = config.liveUrl + imgItm.imageUrl;
                                callback();
                            }, function (err, imgList) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Product Detail.",
                                        "response_data": result
                                    });
                                }
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
    popularProductList: function (callback) {
        ProductSchema.aggregate(
            { $match: { isPopular: 'yes' } },
            { $project: { _id: 1, name: 1, image: 1 } },
            { $sort: { name: 1 } },
            function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        async.forEach(result, function (item, callback) {
                            item.image = config.liveUrl + item.image[0].imageUrl;
                            callback();
                        }, function (err, list) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Popular product list.",
                                "response_data": result
                            });
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Popular product list.",
                            "response_data": {}
                        });
                    }
                }
            });

    },
    productListByVendor: function (data, callback) {
        if (data) {
            ProductSchema.aggregate(
                { $match: { vendor: data._id } },
                { $project: { _id: 1, name: 1, image: 1 } },
                { $sort: { name: 1 } },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        async.forEach(result, function (item, callBack) {
                            item.image = config.liveUrl + item.image[0].imageUrl;
                            callBack();
                        }, function (err, list) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Product list.",
                                "response_data": result
                            });
                        });
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },
    deleteProductImageModel: function (data, callback) {
        if (data) {
            ProductSchema.count(
                { _id: data._id },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (resCount > 0) {
                            //console.log(data);
                            ProductSchema.findOne(
                                { _id: data._id}, 
                                {image:{$elemMatch:{_id: data.imageId}}})
                                .select('image.imageUrl')
                                .then(async res => {
                                    if(res && res.image.length !=0){
                                        
                                        let file_with_path = `./public/${res.image[0].imageUrl}`;
                                        if (fs.existsSync(file_with_path)) {
                                            await fs.unlink(file_with_path, (err) => {
                                                if (err) throw err;
                                                console.log('successfully deleted');
                                            });
                                        }
                                        //console.log(res.image[0].imageUrl);
                                        ProductSchema.findOneAndUpdate(
                                            {  _id: data._id},
                                            { $pull: { image: { _id: data.imageId } } },
                                            { new: true },
                                            function(err) {
                                                if (err) { console.log(err) }
                                                else{
                                                    callback({
                                                        "response_code": 2000,
                                                        "response_message": "Image deleted successfully.",
                                                        "response_data": {}
                                                    });
                                                }
                                            }
                                          )
                                        
                                    }else{
                                        callback({
                                            "response_code": 5002,
                                            "response_message": "Data not found.",
                                            "response_data": err
                                        });
                                    }
                                    
                                })
                            
                        } else {
                            callback({
                                "response_code": 5002,
                                "response_message": "Data not found.",
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
    editProduct: function (data, callback) {
        if (data) {
            var update;
            if(data.image.length != 0){
                update = {
                    $set: {
                        category : data.category,
                        vendor : data.vendor,
                        description : data.description,
                        name : data.name,
                        qty : data.qty,
                        point : data.point,
                    },
                    $push: {image: {$each: data.image}}
                }
            }else{
                update = {
                    $set: {
                        category : data.category,
                        vendor : data.vendor,
                        description : data.description,
                        name : data.name,
                        qty : data.qty,
                        point : data.point,
                    }
                }
            }
            
            ProductSchema.update({_id: data._id}, 
            update, 
            {upsert:true}, function(err){
                if(err){
                    callback({
                        "response_code": 5005,
                        "response_message": "UPDATE ERROR",
                        "response_data": {}
                    });
                }else{
                    callback({
                        "response_code": 2000,
                        "response_message": "Product updated successfully.",
                        "response_data": {}
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
}
module.exports = productModels;
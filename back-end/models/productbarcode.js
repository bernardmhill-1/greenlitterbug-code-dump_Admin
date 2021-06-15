var mongoose = require("mongoose");
var ProductBarcodeSchema = require('../schema/productbarcodes');
var RecycleProductTypeSchema = require('../schema/recycleProductTypes');
var async = require("async");
var config = require('../config');
var fs = require('fs');

var productBarcodeModels = {
    productbarcodeAdd: function (data, callback) {
        if (data) {
            new ProductBarcodeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Product barcode added successfully.",
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
    productBarcodeList: function (data, callback) {
        var limit = parseInt(data.size) + parseInt(data.number);
        var skip = 0;
        if (data) {
            ProductBarcodeSchema.find(
                {},
                {
                    _id: 1,
                    name: 1,
                    image: 1,
                    barcode: 1,
                    productType: 1
                },
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
                                item.image = config.liveUrl + item.image;
                                callBack();
                            }, function (err, cotent) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Product barcode list",
                                    "response_data": result
                                });
                            });
                        } else {
                            callback({
                                "response_code": 2000,
                                "response_message": "Product barcode list",
                                "response_data": {}
                            });
                        }

                    }
                }
            )
                .populate('vendorId', 'ownerName companyName')
                .lean(true)
                .limit(limit).skip(skip)
        } else {
            callback({
                "response_code": 2000,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    productBarcodeMDelete: function (data, callback) {
        if (data) {
            ProductBarcodeSchema.findOne(
                { _id: data._id },
                function (err, resData) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (resData) {
                            ProductBarcodeSchema.remove(
                                { _id: data._id },
                                async function (err, result) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": err
                                        });
                                    } else {
                                        let file_with_path = `./public/${resData.image}`;
                                        if (fs.existsSync(file_with_path)) {
                                            await fs.unlink(file_with_path, (err) => {
                                                if (err) throw err;
                                                console.log('successfully deleted');
                                            });
                                        }
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
    productbarcodeEdit: function (data, callback) {
        if (data) {
            ProductBarcodeSchema.findOne(
                { _id: data._id },
                { image: 1 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "UPDATE ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (data.image == undefined || data.image == null || data.image == '') {
                            data.image = result.image;
                        } else {
                            data.image = data.image;
                        }
                        var update = {
                            $set: {
                                name: data.name,
                                barcode: data.barcode,
                                productType: data.productType,
                                image: data.image
                            }
                        }
                        ProductBarcodeSchema.update({ _id: data._id },
                            update,
                            function (err) {
                                if (err) {
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "UPDATE ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Product barcode updated successfully.",
                                        "response_data": {}
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
    searchProductByBarcode: function (data, callback) {
        if (data) {
            ProductBarcodeSchema.aggregate(
                {
                    $match: {
                        barcode: data.barcode
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
                        _id: 1,
                        image: 1,
                        barcode: 1,
                        name: 1,
                        productType: 1,
                        'RecyclingProductType.productTypeName': 1
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null || result == '' || result == undefined) {
                            callback({
                                "response_code": 5002,
                                "response_message": "Bar code doesn't match any of our products click SKIP to upload product image",
                                "response_data": {}
                            });
                        } else {
                            result  = result[0];
                            result.image = config.liveUrl + result.image;
                            result.RecyclingProductType = result.RecyclingProductType[0].productTypeName;
                            callback({
                                "response_code": 2000,
                                "response_message": "Product Details",
                                "response_data": result
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
    searchProductByBarcodeId: function (data, callback) {
        if (data) {
            ProductBarcodeSchema.findOne(
                { _id: data.barcodeId },
                { _id: 1, image: 1, barcode: 1, name: 1, productType: 1 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null || result == '' || result == undefined) {
                            callback({
                                "response_code": 5002,
                                "response_message": "No product found",
                                "response_data": {}
                            });
                        } else {
                            callback({
                                "response_code": 2000,
                                "response_message": "Product Details",
                                "response_data": result
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
    }
}
module.exports = productBarcodeModels;
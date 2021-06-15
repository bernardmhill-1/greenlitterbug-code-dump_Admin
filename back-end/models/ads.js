var mongoose = require("mongoose");
var AdsSchema = require('../schema/ads');
var async = require("async");
var config = require('../config');
var fs = require('fs');

var adsModels = {
    adsAdd: function (data, callback) {        
        if (data) {
            new AdsSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Vendor added successfully.",
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
    adsListModel: function (data, callback) {
        var limit = parseInt(data.size) + parseInt(data.number);
        var skip = 0;
        if (data) {
            AdsSchema.find(
                { },
                {
                    _id: 1,
                    vendorId: 1,
                    image: 1,
                    isFeatured: 1,
                    content: 1
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
                            // callback({
                            //     "response_code": 2000,
                            //     "response_message": "Ads list",
                            //     "response_data": result
                            // });
                            async.forEach(result, function (item, callBack) {
                                item.image=config.liveUrl+item.image;
                                // //console.log('item',item);
                                // async.forEach(item.products, function (proItem, callback) {
                                //     // proItem.productImg=config.liveUrl+proItem.productImg;
                                //     callback();
                                // }, function (err, list) {

                                // });
                                callBack();
                            }, function (err, cotent) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Ads list",
                                    "response_data": result
                                });
                            });
                        }else{
                            callback({
                                "response_code": 2000,
                                "response_message": "Ads list",
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
    setFeatureAds: function (data, callback) {
        AdsSchema.count(
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
                        AdsSchema.update(
                            { _id: data._id },
                            { $set: { isFeatured: data.isFeatured } },
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
    AdsDelete: function (data, callback) {
        if (data) {
            AdsSchema.findOne(
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
                            AdsSchema.remove(
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
    featuredAdslist: function (data, callback) {
        if (data) {
            AdsSchema.find(
                { isFeatured:"yes"},
                {
                    _id: 1,
                    vendorId: 1,
                    content: 1,
                    image: 1,
                    isFeatured: 1
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
                                item.image=config.liveUrl+item.image;
                                callBack();
                            }, function (err, cotent) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Ads list",
                                    "response_data": result
                                });
                            });
                        }else{
                            callback({
                                "response_code": 2000,
                                "response_message": "Ads list",
                                "response_data": {}
                            });
                        }
                        
                    }
                }
            )
            .populate('vendorId', 'ownerName companyName')
        } else {
            callback({
                "response_code": 2000,
                "response_message": "INTERNAL DB ERROR",
                "response_data": {}
            });
        }
    },
    EditAds: function (data, callback) {
        if (data) {
            
            console.log('data',data);
            AdsSchema.findOne({_id: data._id})
                .then(async ven => {
                    if(ven){

                        
                        if (data.image) {
                            let file_with_path = `./public/${ven.image}`;
                            if (fs.existsSync(file_with_path)) {
                                await fs.unlink(file_with_path, (err) => {
                                    if (err) throw err;
                                    console.log('successfully deleted');
                                });
                            }
                        }

                        var update = {
                            $set: {
                                content: data.content,
                                image: data.image ? data.image : ven.image                                
                            }
                        }
                        console.log('update',update);
                        AdsSchema.update({_id: data._id}, 
                            update, 
                            function(err){
                                if(err){
                                    callback({
                                        "response_code": 5005,
                                        "response_message": "UPDATE ERROR",
                                        "response_data": {}
                                    });
                                }else{
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Ads updated successfully.",
                                        "response_data": {}
                                    });
                                }
                            });
                    
                    
                    }else{
                        callback({
                            "response_code": 5005,
                            "response_message": "No Vendor Found!",
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
}
module.exports = adsModels;
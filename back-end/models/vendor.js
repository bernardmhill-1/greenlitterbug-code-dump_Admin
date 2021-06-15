var mongoose = require("mongoose");
var VendorSchema = require('../schema/vendors');
var async = require("async");
var config = require('../config');
var fs = require('fs');

var VendorModels = {
    AddVendor: function (data, callback) {
        if (data) {
            new VendorSchema(data).save(function (err, result) {
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
    EditVendor: function (data, callback) {
        if (data) {
            
            console.log('data',data);
            VendorSchema.findOne({_id: data._id})
                .then(async ven => {
                    if(ven){
                        
                        if (data.companyLogo) {
                            let file_with_path = `./public/${ven.companyLogo}`;
                            if (fs.existsSync(file_with_path)) {
                                await fs.unlink(file_with_path, (err) => {
                                    if (err) throw err;
                                    console.log('successfully deleted');
                                });
                            }
                        }

                        var update = {
                            $set: {
                                companyName: data.companyName ? data.companyName : ven.companyName,
                                ownerName: data.ownerName ? data.ownerName : ven.ownerName,
                                companyLogo: data.companyLogo ? data.companyLogo : ven.companyLogo,
                                description: data.description ? data.description : ven.description,
                                email: data.email ? data.email : ven.email,
                                phoneNo: data.phoneNo ? data.phoneNo : ven.phoneNo,
                                address: data.address ? data.address : ven.address,
                                websiteUrl: data.websiteUrl ? data.websiteUrl : ven.websiteUrl
                                
                            }
                        }
                        console.log('update',update);
                        VendorSchema.update({_id: data._id}, 
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
                                        "response_message": "Cause updated successfully.",
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
    setFeatureVendor: function (data, callback) {
        VendorSchema.count(
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
                        VendorSchema.update(
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
    vendorDelete: function (data, callback) {
        if (data) {
            VendorSchema.findOne(
                { _id: data._id },
                function (err, res) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (res) {
                            if (res.companyLogo != 'uploads/no-img.jpg') {
                                let file_with_path = `./public/${res.companyLogo}`;
                                if (fs.existsSync(file_with_path)) {
                                    fs.unlink(file_with_path, (err) => {
                                        if (err) throw err;
                                        console.log('successfully deleted');
                                    });
                                }
                            }
                            VendorSchema.remove(
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
    vendorListForAdmin: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            VendorSchema.find(
                {},
                { _id: 1, companyName: 1,ownerName:1,isFeatured:1 })
                .limit(limit)
                .skip(skip)
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
                            "response_message": "Vendor list",
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
    vendorList: function (data, callback) {
        if (data.searchKey == undefined || data.searchKey == null || data.searchKey == '') {
            VendorSchema.aggregate(
                { $project: { _id: 1, companyName: 1, companyLogo: 1 } },
                { $sort: { companyName: 1 } },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        async.forEach(result, function (item, callback) {
                            item.companyLogo = config.liveUrl + item.companyLogo;
                            callback();
                        }, function (err, list) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Vendor list.",
                                "response_data": result
                            });
                        });


                    }
                });
        } else {
            VendorSchema.aggregate(
                {
                    $match: { companyName: { $regex:  data.searchKey , $options: 'i' }}
                },
                { $project: { _id: 1, companyName: 1, companyLogo: 1 } },
                { $sort: { companyName: 1 } },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        async.forEach(result, function (item, callback) {
                            item.companyLogo = config.liveUrl + item.companyLogo;
                            callback();
                        }, function (err, list) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Vendor list.",
                                "response_data": result
                            });
                        });

                    }
                });
        }

    },
    vendorDetail: function (data, callback) {
        VendorSchema.findOne(
            { _id: data._id },
            { _id: 1, companyName: 1, ownerName: 1, companyLogo: 1, description: 1, email: 1, phoneNo: 1, address: 1, websiteUrl: 1 },
            function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    result.companyLogo = config.liveUrl + result.companyLogo;
                    callback({
                        "response_code": 2000,
                        "response_message": "Vendor Detail.",
                        "response_data": result
                    });

                }
            });

    },
    featuredVendorList: function (callback) {
        VendorSchema.aggregate(
            {$match:{isFeatured:'yes'}},
            { $project: { _id: 1, companyName: 1, companyLogo: 1 } },
            { $sort: { companyName: 1 } },
            function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if(result.length>0){
                        async.forEach(result, function (item, callback) {
                            item.companyLogo = config.liveUrl + item.companyLogo;
                            callback();
                        }, function (err, list) {
                            callback({
                                "response_code": 2000,
                                "response_message": "Featured Vendor list.",
                                "response_data": result
                            });
                        });
                    } else{
                        callback({
                            "response_code": 2000,
                            "response_message": "Featured Vendor list.",
                            "response_data": {}
                        });
                    }
                }
            });

    },
}
module.exports = VendorModels;
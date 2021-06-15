var mongoose = require("mongoose");
var CauseSchema = require('../schema/causes');
var async = require("async");
var config = require('../config');

var CauseModels = {
    addCause: function (data, callback) {
        if (data) {
            new CauseSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 2000,
                        "response_message": "Cause added successfully.",
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
    causeListForAdmin: function (data, callback) {
        if (data) {
            var limit = parseInt(data.size) + parseInt(data.number);
            var skip = 0;
            CauseSchema.find(
                {},
                { _id: 1, title: 1 })
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
                            "response_message": "Cause list",
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
    uploadDocCause: function (data, callback) {
        if (data) {
            CauseSchema.update(
                { _id: data._id },
                { $push: { document: data.document } },
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
                            "response_message": "Cause document uploaded successfully.",
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
    causeList: function (data,callback) { 
        if(data.searchKey== undefined || data.searchKey==null || data.searchKey==''){
            CauseSchema.aggregate(
                { $project: { _id: 1, title: 1, description: 1 } },
                { $sort: { title: 1 } },
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
                            "response_message": "Cause list.",
                            "response_data": result
                        });
    
                    }
                });
        } else{
            CauseSchema.aggregate(
                {$match: {
                    $or: [
                        { title: { $regex: data.searchKey, $options: 'i' }}, 
                        { description: { $regex:  data.searchKey, $options: 'i' }}
                    ]
                }},
                { $project: { _id: 1, title: 1, description: 1 } },
                { $sort: { title: 1 } },
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
                            "response_message": "Cause list.",
                            "response_data": result
                        });
    
                    }
                });
        }     
        
    },
    causeDetail: function (data, callback) {
        if (data) {
            CauseSchema.findOne(
                { _id: data._id },
                { _id: 1, title: 1, description: 1, image: 1, document: 1 },
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
                                var doc_length = result.document.length;
                                if (doc_length > 0) {
                                    async.forEach(result.document, function (docItm, callback) {
                                        docItm.fileUrl = config.liveUrl + docItm.fileUrl;
                                        callback();
                                    }, function (err, docList) {
                                        callback({
                                            "response_code": 2000,
                                            "response_message": "Cause Detail.",
                                            "response_data": result
                                        });

                                    });
                                } else {
                                    callback({
                                        "response_code": 2000,
                                        "response_message": "Cause Detail.",
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
    causeDelete: function (data, callback) {
        if (data) {
            CauseSchema.count(
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
                            CauseSchema.remove(
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
}
module.exports = CauseModels;
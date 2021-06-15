var mongoose = require("mongoose");
var ContentSchema = require('../schema/contents');

var ContentModels = {
    contentDetails:function(data,callback){
        ContentSchema.findOne(
            {content_type:data.content_type},
            {title:1,description:1}
        ).exec(function (err, result) {
            if(err){
                callback({
                    "response_code": 5005,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": []
                });
            }else{
                callback({
                    "response_code": 2000,
                    "response_message": "Content Details",
                    "response_data": result
                });
            }
        });
    },
    contentList: function(callback){
        ContentSchema.find(
            function(err,result){
                if(err){
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                }else{
                    callback({
                        "response_code": 2000,
                        "response_message": "Content list",
                        "response_data": result
                    });
                }
            });
    },
    editContent: function(data,callback){
        ContentSchema.update(
            {_id:data._id},
            {
                $set: {description:data.description}
            },
            function(err,result){
                if(err){
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                }else{
                    callback({
                        "response_code": 2000,
                        "response_message": "Description has been updated.",
                        "response_data": {}
                    });
                }
            });
    }
}
module.exports = ContentModels;
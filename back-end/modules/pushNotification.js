var apn = require('apn');
var FCM = require('fcm-push');
var path = require('path');
var config = require('./config')('production');
//=====================APN=================================
var configDataUser = new apn.Provider({
    cert: __dirname + config.USER_APN_CERTI,
    key: __dirname + config.USER_APN_KEY,
    production: true
});
//====================APN=================================
//====================FCM SETUP FOR PUSH NOTIFICATION=================
var serverKey = config.FCM_SERVER_KEY;
var fcm = new FCM(serverKey);
//====================FCM SETUP FOR PUSH NOTIFICATION=================

var pushNotificationService = {
    iosPush: function(iosDriverData, callback) {
        var note = new apn.Notification();
        note.alert = iosDriverData.from;
        //note.payload = iosDriverData; 
        
        apnOne.send(note, iosDriverData.deviceId).then(result => {
            console.log(result.failed);
            callback({
                result: result
            })
        });
    },
    iosPushNotificationUser: function (iosDriverData, callback) {
        var all_data={'all_data':iosDriverData};
        var note = new apn.Notification();
        note.alert = iosDriverData.message;
        note.payload = all_data;
        note.badge=1;
        note.sound="default";
        note.topic = "com.app.MasjidSpeaker.Users";
        configDataUser.send(note, iosDriverData.deviceId).then(result => {
            callback({
                result: result
            })
        });
    },
    iosPushNotificationUserBroadCast: function (iosDriverData, callback) {
        var all_data={'all_data':iosDriverData};
        var myJSON = JSON.stringify(all_data);
        var note = new apn.Notification();
        note.alert = iosDriverData.message;        
        note.payload = all_data;
        note.badge=1;
        note.sound=iosDriverData.sound_type+".mp3";
        //note.sound="six.mp3";
        note.topic = "com.app.MasjidSpeaker.Users";
        configDataUser.send(note, iosDriverData.deviceId).then(result => {
            callback({
                result: result
            })
        });
    },
    
    androidPushNotification: function (androidData, callback) {
        var message = {
            to: androidData.deviceId, // required fill with device token or topics
            collapse_key: 'demo',
            data: {
                rawData: androidData,
                title: androidData.title,
                user_id: androidData.user_id,
                friend_name: androidData.friend_name
            }

        };
        fcm.send(message)
            .then(function (response) {
                console.log("Successfully sent with response: ", response);
                callback({
                    success: true,
                    result: response
                })
            })
            .catch(function (err) {
                console.log("Something has gone wrong!");
                console.error(err);
                callback({
                    success: false,
                    result: err
                })
            })
    },
    androidPushNotificationBroadCast: function (androidData, callback) {
        var message = {
            to: androidData.deviceId, // required fill with device token or topics
            collapse_key: 'demo',
            data: {
                rawData: androidData,
                title: androidData.title,
                user_id: androidData.user_id,
                friend_name: androidData.friend_name,
                sound_type:androidData.sound_type
            }

        };
        fcm.send(message)
            .then(function (response) {
                console.log("Successfully sent with response: ", response);
                callback({
                    success: true,
                    result: response
                })
            })
            .catch(function (err) {
                console.log("Something has gone wrong!");
                console.error(err);
                callback({
                    success: false,
                    result: err
                })
            })
    }
};
module.exports = pushNotificationService;
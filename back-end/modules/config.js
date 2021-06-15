module.exports = function (profile) {
	var profileContainer = {
		"local": {
			USER_APN_CERTI: "/certificate/user/dev/greenliteerdev_Certificates.p12",
			USER_APN_KEY: "/certificate/AuthKey_7JWX427H88.p8",
			FCM_SERVER_KEY: 'AAAABEmjqAk:APA91bFv8R3XQyEhcpd7othybMY2DkyGOORSWyfwOEwCg-qdkBtX-3VvuVkYNeu4IXdlpXhBjMMr5ZnfIpeU62tN1nByCJYI5d8bKG3G3MBuOEUc1Wnzz98pPRNwd7BuU6QrrUn7xRav'
		},
		"production": {
			USER_APN_CERTI: "/certificate/user/production/greenlitterpro_Certificates.p12",
			USER_APN_KEY: "/certificate/AuthKey_7JWX427H88.p8",
			FCM_SERVER_KEY: 'AAAABEmjqAk:APA91bFv8R3XQyEhcpd7othybMY2DkyGOORSWyfwOEwCg-qdkBtX-3VvuVkYNeu4IXdlpXhBjMMr5ZnfIpeU62tN1nByCJYI5d8bKG3G3MBuOEUc1Wnzz98pPRNwd7BuU6QrrUn7xRav'
		}
	}

	return profileContainer[profile];
}
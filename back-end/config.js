               module.exports = {
    "port": 1924,
    "secretKey": "hyrgqwjdfbw4534efqrwer2q38945765",
    production: {
        username: 'brain1uMMong0User',
        password: 'PL5qnU9nuvX0pBa',
        host: 'nodeserver.mydevfactory.com',
        port: '27017',
        dbName: 'recycling',
        authDb: 'admin'
    },
    local: {
        database: "mongodb://localhost:27017/recycling",
        MAIL_USERNAME: "liveapp.brainium@gmail.com",
        MAIL_PASS: "YW5kcm9pZDIwMTY"
    },
    uploadProfilepicPath: "public/uploads/profilepic/",
    profilepicPath: "uploads/profilepic/",
    uploadRecyclingProductpicPath: "public/uploads/recyclingproductpic/",
    recyclingProductpicPath: "uploads/recyclingproductpic/",
    uploadBarCodepicPath: "public/uploads/barcodepic/",
    barCodepicPath: "uploads/barcodepic/",
    uploadCausepicPath: "public/uploads/cause/",
    causepicPath: "uploads/cause/",
    uploadProductpicPath: "public/uploads/product/",
    productpicPath: "uploads/product/",
    uploadCauseDocPath: "public/uploads/cause/doc/",
    causeDocPath: "uploads/cause/doc/",
    uploadCompanyLogoPath: "public/uploads/vendor/",
    companyLogoPath: "uploads/vendor/",
    uploadAdsImagePath: "public/uploads/ads/",
    AdsImagePath: "uploads/ads/",
    uploadBarcodeImagePath: "public/uploads/barcode/",
    BarcodeImagePath: "uploads/barcode/",
    liveUrl: "https://nodeserver.mydevfactory.com:1924/",
    logPath: "/ServiceLogs/admin.debug.log",
    dev_mode: true,
    __root_dir: __dirname,
    __site_url: '',
    limit:10

}
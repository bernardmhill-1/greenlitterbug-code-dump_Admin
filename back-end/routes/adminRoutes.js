var express = require("express");
var jwt = require('jsonwebtoken');
var Admin = require('../models/admin');
var adminService = require('../services/adminService');
var bodyParser = require('body-parser');
var config = require('../config');

var secretKey = config.secretKey;

module.exports = function (app, express) {

  var admin = express.Router();
  admin.use(bodyParser.json());
  admin.use(bodyParser.urlencoded({
    extended: false
  }));
  admin.get('/test', function (req, res, next) {
    res.json({ success: true, message: "Admin routes is working" });
  });

  admin.post('/adminSignup', function (req, res) {
    var adminData = req.body;
    adminService.adminSignup(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/adminLogin', function (req, res) {
    var adminData = req.body;
    adminService.adminLogin(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/forgotpassLinksend', function (req, res) {
    var adminData = req.body;
    adminService.forgotpassLinksend(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/adminForgotPassword', function (req, res) {
    var adminData = req.body;
    adminService.adminForgotPassword(adminData, function (response) {
      res.send(response);
    });
  });
  /******************************
  *  Middleware to check token
  ******************************/
  admin.use(function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.send({
            STATUSCODE: 4002,
            success: false,
            error: true,
            message: "Failed to authenticate or token expired."
          });
        }
        else {
          req.decoded = decoded;
          next();
        }
      });
    }
    else {
      res.send({
        success: false,
        error: true,
        message: "Please provide token"
      });
    }
  });
  /******************************
  *  Middleware to check token
  ******************************/

  admin.post('/adminChangePassword', function (req, res) {
    adminService.adminChangePassword(req.body, function (response) {
      res.send(response);
    });
  });

  //list content
  admin.post('/listContent', function (req, res) {
    adminService.listContent(function (response) {
      res.send(response);
    });
  });

  //Details content
  admin.post('/detailsContent', function (req, res) {
    adminService.detailsContent(req.body, function (response) {
      res.send(response);
    });
  });

  //edit content
  admin.post('/editContent', function (req, res) {
    adminService.editContent(req.body, req.files, function (response) {
      res.send(response);
    });
  });


  //list User
  admin.post('/listUser', function (req, res) {
    adminService.listUser(req.body, function (response) {
      res.send(response);
    });
  });

  //User Details
  admin.post('/detailsUser', function (req, res) {
    adminService.detailsUser(req.body, function (response) {
      res.send(response);
    });
  });
  //User recycle product report
  admin.post('/userReport', function (req, res) {
    adminService.userReport(req.body, function (response) {
      res.send(response);
    });
  });
  // Add Recycling product type
  admin.post('/recyclingProductTypeAdd', function (req, res) {
    adminService.recyclingProductTypeAdd(req.body, function (response) {
      res.send(response);
    });
  });
  // List Recycling product type
  admin.post('/recyclingProductTypeList', function (req, res) {
    adminService.recyclingProductTypeList(req.body, function (response) {
      res.send(response);
    });
  });
  // Edit Recycling product type
  admin.post('/recyclingProductTypeEdit', function (req, res) {
    adminService.recyclingProductTypeEdit(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Recycling product type
  admin.post('/recyclingProductTypeDelete', function (req, res) {
    adminService.recyclingProductTypeDelete(req.body, function (response) {
      res.send(response);
    });
  });
  /////////
  // Add Recycling product Scan Message
  admin.post('/recyclingProductScanMsgAdd', function (req, res) {
    adminService.recyclingProductScanMsgAdd(req.body, function (response) {
      res.send(response);
    });
  });
  // List Recycling product Scan Message
  admin.post('/recyclingProductScanMsgList', function (req, res) {
    adminService.recyclingProductScanMsgList(req.body, function (response) {
      res.send(response);
    });
  });
  // Edit Recycling product Scan Message
  admin.post('/recyclingProductScanMsgEdit', function (req, res) {
    adminService.recyclingProductScanMsgEdit(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Recycling product Scan Message
  admin.post('/recyclingProductScanMsgDelete', function (req, res) {
    adminService.recyclingProductScanMsgDelete(req.body, function (response) {
      res.send(response);
    });
  });
  ////////
  // List Recycling product 
  admin.post('/recyclingProductList', function (req, res) {
    adminService.recyclingProductList(req.body, function (response) {
      res.send(response);
    });
  });
  //Recycling product Details
  admin.post('/recyclingProductDetails', function (req, res) {
    adminService.recyclingProductDetails(req.body, function (response) {
      res.send(response);
    });
  });
  //Add Cause 
  admin.post('/addCause', function (req, res) {
    adminService.addCause(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //Edit Cause 
  admin.post('/editCause', function (req, res) {
    adminService.editCause(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  // List Cause
  admin.post('/listCause', function (req, res) {
    adminService.listCause(req.body, function (response) {
      res.send(response);
    });
  });
  //Upload Cause Doc
  admin.post('/uploadDocCause', function (req, res) {
    adminService.uploadDocCause(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //Cause Details
  admin.post('/detailCause', function (req, res) {
    adminService.detailCause(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Cause
  admin.post('/deleteCause', function (req, res) {
    adminService.deleteCause(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Cause Document
  admin.post('/deleteCauseDocument', function (req, res) {
    adminService.deleteCauseDocumentService(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Cause Image
  admin.post('/deleteCauseImage', function (req, res) {
    adminService.deleteCauseImageService(req.body, function (response) {
      res.send(response);
    });
  });
  //Add Vendor
  admin.post('/addVendor', function (req, res) {
    adminService.addVendor(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //Edit Vendor
  admin.post('/editVendor', function (req, res) {
    adminService.editVendor(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  // Set featured vendor
  admin.post('/setFeatureVendor', function (req, res) {
    adminService.setFeatureVendor(req.body, function (response) {
      res.send(response);
    });
  });
  //Delete Vendor
  admin.post('/deleteVendor', function (req, res) {
    adminService.deleteVendor(req.body, function (response) {
      res.send(response);
    });
  });
  // List Vendor
  admin.post('/listVendor', function (req, res) {
    adminService.listVendor(req.body, function (response) {
      res.send(response);
    });
  });
  //Vendor Details
  admin.post('/detailVendor', function (req, res) {
    adminService.detailVendor(req.body, function (response) {
      res.send(response);
    });
  });
  //Add Product category 
  admin.post('/productCategoryAdd', function (req, res) {
    adminService.productCategoryAdd(req.body, function (response) {
      res.send(response);
    });
  });
  //List Product category 
  admin.post('/productCategoryList', function (req, res) {
    adminService.productCategoryList(req.body, function (response) {
      res.send(response);
    });
  });
  // Edit Product category 
  admin.post('/productCategoryEdit', function (req, res) {
    adminService.productCategoryEdit(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Product category 
  admin.post('/productCategoryDelete', function (req, res) {
    adminService.productCategoryDelete(req.body, function (response) {
      res.send(response);
    });
  });
  // Add product
  admin.post('/addProduct', function (req, res) {
    adminService.addProduct(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //Edit Product 
  admin.post('/editProduct', function (req, res) {
    adminService.editProduct(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //List Product
  admin.post('/productList', function (req, res) {
    adminService.productList(req.body, function (response) {
      res.send(response);
    });
  });
  // Set popular product
  admin.post('/setPopularProduct', function (req, res) {
    adminService.setPopularProduct(req.body, function (response) {
      res.send(response);
    });
  });
  //Product Details
  admin.post('/DetailProduct', function (req, res) {
    adminService.DetailProduct(req.body, function (response) {
      res.send(response);
    });
  });
  //Delete Product
  admin.post('/DeleteProduct', function (req, res) {
    adminService.DeleteProduct(req.body, function (response) {
      res.send(response);
    });
  });
  // Delete Product Image
  admin.post('/deleteProductImage', function (req, res) {
    adminService.deleteProductImageService(req.body, function (response) {
      res.send(response);
    });
  });
  //List Order
  admin.post('/orderList', function (req, res) {
    adminService.orderList(req.body, function (response) {
      res.send(response);
    });
  });
  //Change Order Status
  admin.post('/changeOrderStatus', function (req, res) {
    adminService.changeOrderStatus(req.body, function (response) {
      res.send(response);
    });
  });

  //Add Ads
  admin.post('/addAds', function (req, res) {
    adminService.addAds(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //List Ads
  admin.post('/adsList', function (req, res) {
    adminService.adsList(req.body, function (response) {
      res.send(response);
    });
  });
  // Set featured Ads
  admin.post('/setFeatureAds', function (req, res) {
    adminService.setFeatureAds(req.body, function (response) {
      res.send(response);
    });
  });
  //Delete Ads
  admin.post('/DeleteAds', function (req, res) {
    adminService.DeleteAds(req.body, function (response) {
      res.send(response);
    });
  });
  //Edit Ads
  admin.post('/editAds', function (req, res) {
    adminService.editAds(req.body, req.files, function (response) {
      res.send(response);
    });
  });

  //Add Product barcode
  admin.post('/addProductbarcode', function (req, res) {
    adminService.addProductbarcode(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //List Product barcode
  admin.post('/productBarcodeList', function (req, res) {
    adminService.productBarcodeList(req.body, function (response) {
      res.send(response);
    });
  });
  //Edit Product barcode
  admin.post('/editProductBarcode', function (req, res) {
    adminService.editProductBarcode(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  //Delete Product barcode
  admin.post('/deleteProductbarcode', function (req, res) {
    adminService.deleteProductbarcode(req.body, function (response) {
      res.send(response);
    });
  });
    // Recycling Product type listing
    admin.post('/recyclingProductTypeAllList', function (req, res) {
      adminService.recyclingProductTypeAllList(function (response) {
        console.log('response',response);
        res.send(response);
      });
    });
  return admin;
}

'use strict';
var express = require("express");
var apiService = require('../services/apiService');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config');

var secretKey = config.secretKey;

module.exports = function (app, express) {

  var api = express.Router();
  api.use(bodyParser.json());
  api.use(bodyParser.urlencoded({
    extended: false
  }));
  // Content page
  api.get('/cms', function (req, res) {
    apiService.cms(req.query, function (response) {
      res.send(response);
    });
  });
  //Register
  api.post('/register', function (req, res) {
    apiService.register(req.body, function (response) {
      res.send(response);
    });
  });
  //Email Verification
  api.post('/emailVerification', function (req, res) {
    apiService.emailVerification(req.body, function (response) {
      res.send(response);
    });
  });
  // Resend email verification code
  api.post('/resendEmailVerifyCode', function (req, res) {
    apiService.resendEmailVerifyCode(req.body, function (response) {
      res.send(response);
    });
  });
  //login
  api.post('/login', function (req, res) {
    apiService.login(req.body, function (response) {
      res.send(response);
    });
  });
  //Forgot password
  api.post('/forgotPassword', function (req, res) {
    apiService.forgotPassword(req.body, function (response) {
      res.send(response);
    });
  });
  //Verify otp for forgotpassword
  api.post('/verifyOtp', function (req, res) {
    apiService.verifyOtp(req.body, function (response) {
      res.send(response);
    });
  });
  //Reset password
  api.post('/resetPassword', function (req, res) {
    apiService.resetPassword(req.body, function (response) {
      res.send(response);
    });
  });
  //Search Recycling product
  api.post('/searchRecyclingProduct', function (req, res) {
    apiService.searchRecyclingProduct(req.body, function (response) {
      res.send(response);
    });
  });
  /******************************
  *  Middleware to check token
  ******************************/
  api.use(function (req, res, next) {
    var token = req.body.authtoken || req.params.authtoken || req.headers['authtoken'];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.send({
            response_code: 4000,
            response_message: "Session timeout! Please login again.",
            response_data: err
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
        "response_code": 5002,
        "response_message": "Please provide required information"
      });
    }
  });
  /******************************
  *  Middleware to check token
  ******************************/
  // View Profile
  api.post('/viewProfile', function (req, res) {
    apiService.viewProfile(req.body, function (result) {
      res.send(result);
    })
  });
  // Edit Profile Image
  api.post('/editProfileImage', function (req, res) {
    apiService.editProfileImage(req.body, req.files, function (result) {
      res.send(result);
    })
  });
  // Change password
  api.post('/changePassword', function (req, res) {
    apiService.changePassword(req.body, function (result) {
      res.send(result);
    });
  });
  // Edit Profile
  api.post('/editProfile', function (req, res) {
    apiService.editProfile(req.body, function (result) {
      res.send(result);
    });
  });
  // Recycling Product type listing
  api.post('/recyclingProductTypeList', function (req, res) {
    apiService.recyclingProductTypeList(function (response) {
      res.send(response);
    });
  });
  api.post('/recyclingProductScanMsgList', function (req, res) {
    apiService.recyclingProductScanMsgList(req.body, function (response) {
      res.send(response);
    });
  });
  //Recycling product add
  api.post('/recyclingProductAdd', function (req, res) {
    apiService.recyclingProductAdd(req.body, req.files, function (result) {
      res.send(result);
    });
  });
  //Recycling product list by user
  api.post('/recyclingProductListByUser', function (req, res) {
    apiService.recyclingProductListByUser(req.body, function (result) {
      res.send(result);
    });
  });
  //Recycling product bar chart
  api.get('/recyclingProductBarChart', function (req, res) {
    apiService.recyclingProductBarChart(req.query, function (result) {
      res.send(result);
    });
  });
  //Recycling product pie chart
  api.get('/recyclingProductPieChart', function (req, res) {
    apiService.recyclingProductPieChart(req.query, function (result) {
      res.send(result);
    });
  });
  
  // Cause listing
  api.post('/causeList', function (req, res) {
    apiService.causeList(req.body, function (response) {
      res.send(response);
    });
  });
  //Cause details
  api.post('/causeDetail', function (req, res) {
    apiService.causeDetail(req.body, function (result) {
      res.send(result);
    });
  });
  //Vendor listing
  api.post('/vendorList', function (req, res) {
    apiService.vendorList(req.body, function (response) {
      res.send(response);
    });
  });
  //Vendor details
  api.post('/vendorDetail', function (req, res) {
    apiService.vendorDetail(req.body, function (result) {
      res.send(result);
    });
  });
  //Home page
  api.post('/home', function (req, res) {
    apiService.home(function (result) {
      res.send(result);
    });
  });
  // Product Category list
  api.post('/productCategoryList', function (req, res) {
    apiService.productCategoryList(function (response) {
      res.send(response);
    });
  });
  // Product list
  api.post('/productList', function (req, res) {
    apiService.productList(req.body, function (response) {
      res.send(response);
    });
  });
  //Product Details
  api.post('/productDetail', function (req, res) {
    apiService.productDetail(req.body, function (response) {
      res.send(response);
    });
  });
  // Add to cart
  api.post('/addTocart', function (req, res) {
    apiService.addTocart(req.body, function (response) {
      res.send(response);
    });
  });
  //Cart list
  api.post('/cartList', function (req, res) {
    apiService.cartList(req.body, function (response) {
      res.send(response);
    });
  });
  // Product qty update in cart
  api.post('/cartQuatityUpdate', function (req, res) {
    apiService.cartQuatityUpdate(req.body, function (response) {
      res.send(response);
    });
  });
  // Product delete from cart
  api.post('/cartProductDelete', function (req, res) {
    apiService.cartProductDelete(req.body, function (response) {
      res.send(response);
    });
  });
  // Add shipping address
  api.post('/addShippingAddress', function (req, res) {
    apiService.addShippingAddress(req.body, function (response) {
      res.send(response);
    });
  });
   // Details of shipping address
   api.post('/viewShippingAddress', function (req, res) {
    apiService.viewShippingAddress(req.body, function (response) {
      res.send(response);
    });
  });
  // Order checkout
  api.post('/checkOut', function (req, res) {
    apiService.checkOut(req.body, function (response) {
      res.send(response);
    });
  });
   // Order list
   api.post('/orderList', function (req, res) {
    apiService.orderList(req.body, function (response) {
      res.send(response);
    });
  });
  // Contact Us
  api.post('/contactUs', function (req, res) {
    apiService.contactUs(req.body, function (response) {
      res.send(response);
    });
  });
  // Featured Ads list
  api.post('/featuredAdsList', function (req, res) {
    apiService.featuredAdsList(req.body, function (response) {
      res.send(response);
    });
  });
  
  return api;
}
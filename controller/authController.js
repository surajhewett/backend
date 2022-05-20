const Auth = require("../model/auth");
require("dotenv").config();
const KEY = process.env.DEV_KEY;
var jwt = require('jsonwebtoken');

module.exports = {
    userLogin: function (req, res) {
        Auth.callUserLogin(req.connection, req.body.mobile, req.body.password, function (err, row) {
            if (row != undefined && row.length) {
                Auth.callUpdateFcm(req.connection, req.body.mobile, req.body.fcmkey, function (err, row) {

                });
                
                var payload = {
                    mobile: req.body.mobile,
                };
                var token = jwt.sign(payload, KEY, { algorithm: 'HS256', expiresIn: "15d" });
                res.json({
                    "message":"success",
                    "status":true,
                    "accessToken":token,
                    "responce":row,
                })
            } else {
                res.status(400).json({"status":false,"message":"Invalid Mobile Number or Password"});
            }
        })
    },
    userRegistration: function(req, res) {
        Auth.callUserRegistration(req.connection, req.body.name, req.body.mobile, req.body.email, req.body.password, function (err, row) {
            if (err) {
                res.status(400).json({"status":false,"message":err.message});
                return;
              }
              res.json({
                  "message":"success",
                  "status":true
              })
        });
    },
    getUserDetails: function(req, res) {
        var str = req.get('Authorization');
        try {
            jwt.verify(str, KEY, { algorithm: 'HS256' });
            Auth.callGetUserDetails(req.connection, req.body.userId, function (err, row) {
                if (err) {
                    res.status(400).json({"status":false,"message":err.message});
                    return;
                  }
                  res.json({
                      "message":"success",
                      "status":true,
                      "responce":row
                  })
            });
        } catch {
            res.status(401);
            res.send("Session Expire");
        }
    },

    home: function (req, res) {
        var str = req.get('Authorization');
        try {
            jwt.verify(str, KEY, { algorithm: 'HS256' });
            res.send("Welcome");
        } catch {
            res.status(401);
            res.send("Bad Token");
        }
    },

    

    newsignup: function(req, res) {
        console.log("username-"+req.body.username+",password-"+req.body.password)
        Auth.selectSignUp(req.connection, req.body.username, req.body.password, function (err, row) {
            if (row != undefined && row.length) {
                res.status(409);
                res.send("An user with that username already exists");
              } else {
                Auth.insert(req.connection, req.body.username, req.body.password, function (err, result) {
                    if (err) throw err;
                  });
                res.status(201);
                res.send("Success");
              }
    
        });
    },

    getUserList: function(req, res) {
        Auth.fetchAllUser(req.connection, function (err, rows) {
            if (err) {
                res.status(400).json({"error":err.message,"message":"failed","responce":rows});
                return;
              }
              res.json({
                  "message":"success",
                  "responce":rows
              })
    
        });
    }
};


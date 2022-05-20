const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post('/UserLogin', authController.userLogin);
router.post('/UserRegistration', authController.userRegistration);
router.post('/GetUserDetails', authController.getUserDetails);
router.get('/data', authController.home);
router.post('/newsignup', authController.newsignup);
router.post('/UserList', authController.getUserList);

module.exports = router;
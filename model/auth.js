var crypto = require('crypto');
const date = require('date-and-time')

module.exports = {
    callUserLogin: function (connection, mobile, password, callback) {
        var cryptPassword = crypto.createHash('sha256').update(password).digest('hex');
        console.log("cryptPassword- "+cryptPassword)
        connection.query("SELECT userid,name,mobile,email,profile_image,gender,dob,fcm_key,my_referral_code FROM tbl_user_registration WHERE mobile = ? AND password = ?", [mobile, cryptPassword], callback);
    },
    callUpdateFcm: function (connection, mobile,fcmkey, callback) {
        connection.query("UPDATE tbl_user_registration SET fcm_key = ? WHERE tbl_user_registration.mobile = ?", [fcmkey, mobile], callback);
    },
    callUserRegistration: function (connection, name,mobile,email, password, callback) {
        var userid="USER"+random(1000000, 9999999)
        var referralCode=""+random_charecter(6);
        var entry_date=""+current_date()
        console.log("entry_date- "+entry_date)

        var cryptPassword = crypto.createHash('sha256').update(password).digest('hex');
        var credentials = [[userid,name,mobile,email, cryptPassword,referralCode,entry_date]];
        console.log("resquest- "+credentials)
        connection.query("INSERT INTO tbl_user_registration (userid,name, mobile,email,password,my_referral_code,entry_date) VALUES ?", [credentials], callback);
    },
    callGetUserDetails: function (connection, userId, callback) {
        connection.query("SELECT * FROM tbl_user_registration WHERE userid = ?", [userId], callback);
    },
    newselectSignUp: function (connection, callback) {
        connection.query("SELECT * FROM users", callback);
    },
    
    
    fetchAllUser: function (connection, callback) {
        connection.query("SELECT * FROM users", callback);
    },
};

function random(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

function current_date() {  
    const now  =  new Date();
    return date.format(now,'DD MMM YYYY HH:mm:ss');
}

function random_charecter(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

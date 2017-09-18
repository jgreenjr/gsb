var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gsb');

var userService = require('../Services/UserServices.js');

userService.FindUserByName('admin@gsb.com', function (hasUser) {
    if (hasUser === null) {
        console.log('no admin');
        userService.CreateUserAndMetaData('admin@gsb.com', 'password1', 'MainBank', function  (err, user) {
            console.log(err || user);
        });
    }
});
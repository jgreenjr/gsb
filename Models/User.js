/**
 * Created by greenj on 8/11/16.
 */

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var db = mongoose.createConnection("mongodb://localhost/gsb")

var Schema = mongoose.Schema;

var User = new Schema({
    email: String,
    password: String,
    Pin: String,
    defaultBank: String,
    RedirectUrl: String,
    canCreateUser: Boolean,
    canCreateBank: Boolean
});

User.pre("save",function(next) { var user = this;
// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

// generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.pre("save",function(next) { var user = this;
// only hash the password if it has been modified (or is new)
    if (!user.isModified('Pin')) return next();

// generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.Pin, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.Pin = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


User.methods.comparePin = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.Pin, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}


module.exports  = db.model('User', User);

/**
 * Created by greenj on 8/11/16.
 */

var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var Schema = mongoose.Schema;

var defaultBank = new Schema({
    bankId: String,
    Name: String
});

var User = new Schema({
    email: String,
    password: String,
    Pin: String,
    defaultBank: defaultBank,
    RedirectUrl: String,
    canCreateUser: Boolean,
    canCreateBank: Boolean,
    PlanId: String
});

User.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }
    // generate a salt

    user.password = passwordHash.generate(user.password);
    next();
});

User.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('Pin')) {
        return next();
    }

    // generate a salt
    user.Pin = passwordHash.generate(user.Pin);
});

User.methods.comparePassword = function (candidatePassword, cb) {
    return cb(null, passwordHash.verify(candidatePassword, this.password));
};

User.methods.comparePin = function (candidatePassword, cb) {
    return cb(null, passwordHash.verify(candidatePassword, this.Pin));
};

module.exports = mongoose.model('User', User);

var User = require('../Models/User.js');
var PlanService = require('../Services/PlanService.js');
var BankService = require('../Services/BankService.js')

module.exports = {
    ValidateUserPin: function (username, pin, payee, callback) {
        User.findOne({ email: username }, function (err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (user.Pin === undefined || user.Pin === '' || !user.Pin) {
                callback('No Pin Set');
                return;
            }

            if (user.defaultBank === '') {
                callback('No Default Bank Set');
                return;
            }

            user.comparePin(pin, function (err, isMatch) {
                if (err || !isMatch) {
                    callback('Bad Pin');
                    return;
                }
                callback(null, { 'username': user.username, 'RedirectUrl': user.RedirectUrl, 'defaultBank': user.defaultBank });
            });
        });
    },

    GetUser: function (id, callback) {
        User.findOne({ id: id }, function (err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (!user) {
                return callback('User Not Found');
            }

            return callback(null, user);
        });
    },

    GetUserPermissions: function (username, callback) {
        User.findOne({ email: username }, function (err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (!user) {
                return callback('User Not Found');
            }

            callback(null, { canCreateUser: user.canCreateUser, canCreateBank: user.canCreateBank });
        });
    },

    LoginUser: function (username, password, callback) {
        User.findOne({ email: username }, function (err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (!user) {
                return callback('User Not Found');
            }

            user.comparePassword(password, function (err, isMatch) {
                if (err || !isMatch) {
                    return callback('bad password', null);
                }
                var returnValue = { 'username': user.username, 'RedirectUrl': user.RedirectUrl, 'defaultBank': user.defaultBank };
                callback(null, returnValue);
            });
        });
    },

    CreateUserAndMetaData: function (username, password, defaultBank, callback) {
        this.CreateUser(username, password, defaultBank, function (err, user) {
            console.log('user created');
            if (err) {
                return callback(err);
            }
            PlanService.InsertPlan(user._id, {'Name': 'Main Plan'}, function (err, plan) {
                console.log('plan created')
                console.log(err)
                if (err) {
                    return callback(err);
                }
                BankService.Create('Main Account', user._id, function (err, bank) {
                    console.log('bank created')
                    if (err) {
                        return callback(err);
                    }
                    user.defaultBank = { bankId: bank._id, Name: bank.Name };
                    user.PlanId = plan._id;
                    user.save(callback)
                })
            })
        })
    },
    CreateUser: function (username, password, defaultBank, callback) {
        var user = new User();
        user.email = username;
        user.password = password;
        user.canCreateBank = false;
        user.canCreateUser = false;
        user.defaultBank = defaultBank;
        user.RedirectUrl = 'private/bank.html';

        user.save(function (err, data) {
            if (err) {
                return callback(err);
            }
            return callback(null, data);
        });
    },

    UpdateUser: function (username, password, defaultBank, pin, callback) {
        User.findOne({ email: username }, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (user === null) {
                callback('User not found');
                return;
            }

            if (pin !== '') {
                user.Pin = pin;
            }

            if (password !== '') {
                user.password = password;
            }

            user.defaultBank = defaultBank;

            user.save(function (err, data) {
                if (err) {
                    callback(err);
                }
                callback(null, data);
            });
        });
    },
    FindUserByName: function (username, cb) {
        User.findOne({ 'email': username }, function (err, data) {
            if (err) {
                cb(null);
            }
            return cb(data);
        });
    }
};
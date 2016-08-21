module.exports = function (User) {
  ValidateUserPin = function (username, pin, payee, callback) {
    User.findOne({email: username}, function (err, user) {
      if (err) {
        callback(err);
        return;
      }

      if (user.Pin === undefined || user.Pin === "" || !user.Pin) {
        callback("No Pin Set");
        return;
      }

      if (user.defaultBank === "") {
        callback("No Default Bank Set");
        return;
      }


      user.comparePin(pin, function (err, isMatch) {
        if (err || !isMatch) {
          callback("Bad Pin");
          return;
        }
        callback(null, {"username": user.username, "RedirectUrl": user.RedirectUrl, "defaultBank": user.defaultBank});
      });
    });
  };

  this.GetUser = function (id, callback) {
    User.findOne({id: id}, function (err, user) {
      if (err) {
        callback(err);
        return;
      }

      if (!user) {
        return callback("User Not Found");
      }

      return callback(null, user);

    });
  };

  this.GetUserPermissions = function (username, callback) {
    User.findOne({email: username}, function (err, user) {
      if (err) {
        callback(err);
        return;
      }

      if (!user) {
        return callback("User Not Found");
      }

      callback(null, {canCreateUser: user.canCreateUser, canCreateBank: user.canCreateBank});
    });
  };

  this.LoginUser = function (username, password, callback) {
    User.findOne({email: username}, function (err, user) {
      if (err) {
        callback(err);
        return;
      }

      if (!user) {
        return callback("User Not Found");
      }

      user.comparePassword(password, function (err, isMatch) {
        if (err || !isMatch) {
          return callback("bad password", null);
        }
        var returnValue = {"username": user.username, "RedirectUrl": user.RedirectUrl, "defaultBank": user.defaultBank};
        callback(null, returnValue);

      });
    });
  };

  this.CreateUser = function (username, password, defaultBank, callback) {

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


  };


  this.UpdateUser = function (username, password, defaultBank, pin, callback) {

    User.findOne({email: username}, function (err, user) {
      if (user === null) {
        callback("User not found");
        return;
      }

      if (pin !== "") {
        user.Pin = pin;
      }

      if (password !== "") {
        user.password = password;
      }

      user.defaultBank = defaultBank;

      user.save(function (err, data) {
        callback(null, user);
      });
    });
  };

  return this;
};
/**
 * Created by greenj on 8/20/16.
 */
module.exports = function( authFunction ){
    var passport = require('passport');
    var BasicStrategy = require("passport-http").BasicStrategy;

    passport.use(new BasicStrategy( authFunction ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null,user);
    });

    return passport

}
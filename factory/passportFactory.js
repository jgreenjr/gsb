/**
 * Created by greenj on 8/20/16.
 */
module.exports = function (authFunction) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(authFunction));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    return passport
}

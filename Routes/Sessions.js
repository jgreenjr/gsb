/**
 * Created by greenj on 8/13/16.
 */
var express = require('express');
var createRoute = function (passport, AuthenticationService) {
    return express.Router()
        .get('/', AuthenticationService.IsAuthenticated, function (req, res) {
            res.send(req.session.passport.user);
        })
        .put('/', passport.authenticate('local', {session: true}), function (req, res) {
            res.send(req.user);
        });
};

module.exports = createRoute;

var User = require('../Models/User.js');
var UserServices = require('../Services/UserServices.js');
var express = require('express');
var _ = require('lodash');

var buildRouter = function (AuthenticationService) {
    var route = express.Router();

    route
        .all('*', AuthenticationService.IsAuthenticated)
        .get('/', function (req, res) {
            User.find({'_id': req.user._id}, function (err, data) {
                if (err) {
                    res.statusCode(400).send(err);
                }
                var returnData = _.map(data, function (d) {
                    return {
                        id: d._id,
                        email: d.email,
                        defaultBank: d.defaultBank
                    };
                });
                res.send(returnData[0]);
            });
        }).post('/', function (req, res) {
            UserServices.CreateUser(req.body.email, req.body.password, req.body.defaultBank, function (err, msg) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.status(201).send({'msg': 'created'});
            });
        }).get('/:id', function (req, res) {
            UserServices.GetUser(req.param.email, function (err, data) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                data.password = undefined;
                data.Pin = undefined;
                res.status(200).send(data);
            }
        );
        }).post('/:id', function (req, res) {
            UserServices.UpdateUser(req.body.email, req.body.password, req.body.defaultBank, req.body.Pin, function (err, data) {
                if (err) {
                    res.statusCode(400);
                }
                res.send(err || data);
            })
        });

    return route;
};

module.exports = buildRouter;

var express = require('express');
var PlanService = require('../Services/PlanService.js');

module.exports = express.Router()
    .get('/', function (req, res) {
        PlanService.GetPlans(req.user._id, function (err, response) {
            res.send(err || response);
        })
    })
    .get('/:planId', function (req, res) {
        PlanService.GetPlan(req.user._id, req.params.planId, function (err, response) {
            if (err) {
                res.status(400);
            }
            res.send(err || response);
        })
    })
    .get('/:planId/:bankId', function (req, res) {
        PlanService.GeneratePlan(req.user._id, req.params.planId, req.params.bankId, new Date(), req.query.days, req.query.autoPopulate, function (err, response) {
            res.send(err || response);
        })
    })
    .put('/', function (req, res) {
        PlanService.InsertPlan(req.user._id, req.body, function (err, response) {
            res.send(err || response);
        })
    })
    .post('/:planId', function (req, res) {
        PlanService.UpdatePlan(req.user._id, req.params.planId, req.body, function (err, response) {
            res.send(err || response);
        })
    })
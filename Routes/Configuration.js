var express = require('express');

module.exports = function (AuthenticationService, bankService) {
    return express.Router()
        .all(AuthenticationService.IsAuthenticated)
        .get('/bank', function (req, res) {
            bankService.GetAll(req.userId, function (err, data) {
                if (err) {
                    return res.status(400).send(err);
                }

                return res.send(data);
            });
        });
};

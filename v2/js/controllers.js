'use strict';
var gsb = angular.module('gsbApp', []);
/* App Module */

gsb.controller('quickAddCtrl', ['$http',

    function ($http) {
        this.transaction = {};
        this.SaveTransaction = function () {
            var req = {
                method: 'POST',
                url: '/Transaction',
                headers: {
                    'username': this.transaction.email,
                    'signature': this.calculateHash(),
                    'content-type': 'text/json',
                    'accept': "text/plain"
                },
                data: JSON.stringify({
                    "payee": this.transaction.payee,
                    "date": this.transaction.date,
                    "amount": this.transaction.amount,
                    "type": "widthdrawl",
                    "Status": "Pending"
                })
            }
            var object = this;
            $http(req).success(function () {
                object.transaction = {};
                alert("Transaction Added")
            }).error(function () {
                alert('Something went wrong: Check PIN')
            });
        };

        this.calculateHash = function () {
            return CryptoJS.MD5(this.transaction.email + this.transaction.pin);
        }
    }]);

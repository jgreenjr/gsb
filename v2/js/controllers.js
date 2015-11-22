'use strict';
var gsb = angular.module('gsbApp', ['ngCookies']);
/* App Module */

gsb.controller('quickAddCtrl', ['$http','$cookies',

    function ($http, $cookies) {
        console.log($cookies);
        var d = new Date();
        var today = (d.getMonth()+1)+"/"+ d.getDate()+"/"+ d.getFullYear();

        var cookieEmail = $cookies["email"];
        this.transaction = {'date':today, 'email': cookieEmail};
        this.SaveTransaction = function () {
            var req = {
                method: 'POST',
                url: '/Transaction',
                headers: {
                    'username': this.transaction.email,
                    'signature': this.calculateHash(),
                    'content-type': 'application/json',
                    'accept': "application/plain"
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

                alert("Transaction Added")
                $cookies["email"] = object.transaction.email;
                object.transaction = {'email':  object.transaction.email, 'date':today};
            }).error(function () {
                alert('Something went wrong: Check PIN')
            });
        };

        this.calculateHash = function () {
            return CryptoJS.MD5(this.transaction.email + this.transaction.pin);
        }
    }]);

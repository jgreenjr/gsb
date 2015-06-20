'use strict';
var gsb = angular.module('gsbApp', []);
gsb.controller("UserController", ['$http', function($http){
    this.username="admin@gsb.com";
    this.banks = [{"displayName": "default1"},{"displayName": "default2"}];
    this.defaultBank = "default2";

    this.Save = function(){}

}]);
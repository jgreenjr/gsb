'use strict';
var gsb = angular.module('gsbApp', ['ngCookies']);
gsb.controller("UserController", ['$http','$cookies', function($http, $cookies){
    var self = this;
    this.Pin ="";
    this.password = "";
    $http.get("/banks")
        .success(function(data){
            self.username = data.username;
            self.banks = data.banks;
        });

    this.defaultBank = $cookies.defaultBank;

    this.Save = function(){

        var data = JSON.stringify ({"username":this.username, "defaultBank": this.defaultBank, "Pin":this.Pin, "password": this.password});

        $http.put("/users", data, {"headers":{'content-type': 'text/json',
            'accept': "text/plain"}}).success(function(arg1, arg2){
            alert("updated")}).error(function(arg1, arg2){
            alert("failed")});
    };

}]);
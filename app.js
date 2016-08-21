/**
 * Created by greenj on 8/12/16.
 */
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser= require("body-parser");

var User = require("./Models/User.js");
var AuthenticationService = require("./Services/AuthenticationService.js")(User);

var app = express();
var passport = require('./factory/passportFactory.js')(AuthenticationService.Authenticate);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({secret:"softkitty", saveUninitialized:true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());

app.all('/V2/private/**', AuthenticationService.IsAuthenticated);

app.use(express.static(__dirname + '/html/public'));
app.use('/private', express.static(__dirname + '/html/private'));
app.use('/V2', express.static(__dirname + '/v2'));
app.use('/V2/bower_components',express.static(__dirname + '/bower_components'));

app.use("/User", require("./Routes/Users.js")(AuthenticationService));
app.use('/Session', require('./Routes/Sessions.js')(passport, AuthenticationService));
app.use('/Bank', require('./Routes/Bank.js')(AuthenticationService));


app.get("/check",function(req, res){
    res.send({asdf:"asdf"});
});

var server = app.listen(8888, function () {

        var host = server.address().address;
        var port = server.address().port;


        console.log('Example app listening at http://%s:%s', host, port);
    });

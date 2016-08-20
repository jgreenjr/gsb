/**
 * Created by greenj on 8/12/16.
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bodyParser= require("body-parser");
var BasicStrategy = require("passport-http").BasicStrategy;

var User = require("./Models/User.js");
var AuthenticationService = require("./Services/AuthenticationService.js")(User);

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({secret:"softkitty", saveUninitialized:true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new BasicStrategy( AuthenticationService.Authenticate));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});

app.use("/User", require("./Routes/Users.js")(AuthenticationService));
app.use('/Session', require('./Routes/Sessions.js')(passport, AuthenticationService));
app.use('/Bank', require('./Routes/Bank.js')(AuthenticationService));


app.get("/check",function(req, res){
    res.send({asdf:"asdf"});
});

var server = app.listen(8888, function () {

        var host = server.address().address;
        var port = server.address().port;


        console.log('Example app listening at http://%s:%s', host, port)
    })

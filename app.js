/**
 * Created by greenj on 8/12/16.
 */
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var User = require('./Models/User.js');
var path = require('path');
var AuthenticationService = require('./Services/AuthenticationService.js')(User);
var mongoose = require('mongoose');
var config = require('./config.json');
mongoose.connect(config.ConnectionString);

var app = express();
var passport = require('./factory/passportFactory.js')(AuthenticationService.Authenticate);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: config.Secret, saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.all('/V2/private/**', AuthenticationService.IsAuthenticated);

app.use(express.static(path.join(__dirname, '/html/public')));
app.use('/private', express.static(path.join(__dirname, '/html/private')));
app.use('/V2', express.static(path.join(__dirname, '/v2')));
app.use('/V2/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.use('/User', require('./Routes/Users.js')(AuthenticationService));
app.use('/Session', require('./Routes/Sessions.js')(passport, AuthenticationService));
app.use('/Bank', require('./Routes/Bank.js')(AuthenticationService));
app.use('/Summary', require('./Routes/Summary.js')())
var budgetRouter = require('./Routes/Budgets.js')();
app.use('/Budget', budgetRouter);
app.use('/Config', require('./Routes/Configuration.js'));
app.use('/Category', require('./Routes/Category.js'));
app.use('/Transaction', require('./Routes/Transaction.js')());
app.use('/Plan', require('./Routes/Plan.js'));
app.get('/check', function (req, res) {
    res.send({ asdf: 'asdf' });
});

app.listen(config.Port, function (arg1) {
    console.log('Example app listening', arg1);
});
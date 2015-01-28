var express = require('express');
var passport = require('passport');
var level = require("level");
var sub = require("level-sublevel");
var Transaction = require("./Transaction.js");
var db = sub(level("./data",{valueEncoding:"json"}));

var UserRepository = require('./Users/UsersRepository.js')(db);
var BankMetaDataRepository = require('./bankMetaData/BankMetaDataRepository.js')(db);
var CategoriesRepository = require('./Categories/CategoryRepository.js')(db);
var BankRepository = require('./Bank/BankRepository.js')(db);
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var session = require('express-session');
var bodyParser= require("body-parser");
var fs = require("fs");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(session({secret:"softkitty", saveUninitialized:true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    UserRepository.GetUser(username, function(err, user){
      if(err != null){
        return done(null, false,{message: 'Incorrect Username or Password'});
      }
      return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    return res.redirect("/login.html");
  }

  app.all('/private/**', isAuthenticated)

app.use(express.static(__dirname + '/html/public'));
app.use('/private', express.static(__dirname + '/html/private'));

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
  });


app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});


// As with any middleware it is quintessential to call next()
// if the user is authenticated

app.get('/banks', isAuthenticated, function(req, res){
  var userName = req.user.username;
  BankMetaDataRepository.GetAllUserBanks(userName,function(err, bankAccessList){
    var returnValue = {username: userName , banks: bankAccessList}

    res.status(200).send(returnValue);
  });
});

app.get('/BankConfiguration', isAuthenticated, function(req, res){
  var userName = req.user.username;
  BankMetaDataRepository.GetFullBankData(userName,function(err, bankAccessList){
    res.status(200).send(bankAccessList);
  });
});

app.get('/categories', isAuthenticated, function(req, res){
  CategoriesRepository.GetList(null, function(err, data){
    res.status(200).send(data);
  });
});

app.get('/banks/:bank', isAuthenticated, function(req, res){
  var bank = req.params.bank
  BankRepository.GetDisplay(bank, req.query.PageNumber, req.query.StatusFilter, req.query.CategoryFilter, req.query.ShowFutureItems, function(err, data){
    res.status(200).send(data);
  } );
})

app.post("/banks/:bank", isAuthenticated, handleTransaction);
app.put("/banks/:bank", isAuthenticated, handleTransaction);
app.delete("/banks/:bank/:transactionid", isAuthenticated, function(req, res){
  var bank = req.params.bank;
  var id = req.params.transactionid;

  BankRepository.DeleteTransaction(bank, id, function(err){
    if(err != undefined && err != null){
      res.status(400).send("error deleting transaction");
      return;
    }
    res.status(200).send("{'message':'deleted'}")
  });
});

function handleTransaction(req, res){
  var bank = req.params.bank;
  req.on("data", function(stream){
    var trans = {};
    var myText = stream.toString();
    try{
      trans = JSON.parse(myText)
      var errs = Transaction.Validate(trans);
      BankRepository.AddTransaction(bank, trans, function(err){
        if(err != undefined && err != null){
          res.status(400).send("error adding transaction");
          return;
        }
        res.status(200).send("{'message':'saved'}")
      });
    }catch(ex){
      res.status(400).send("bad")
      return;
    }
  }
);


}


var port = process.env.PORT;
if(process.argv[2])
{
    port = process.argv[2]
}

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port


  console.log('Example app listening at http://%s:%s', host, port)
})

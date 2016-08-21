var express = require('express');

var Transaction = require("./Transaction.js");

var UserRepository = require('./Services/UserServices.js')();
var BankMetaDataRepository = require('./bankMetaData/BankMetaDataRepository.js')();
var CategoriesRepository = require('./Categories/CategoryRepository.js')();
var BankRepository = require('./Bank/BankRepository.js')();
var PlanRepository = require('./Plan/PlanRepository.js')();
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var session = require('express-session');
var bodyParser= require("body-parser");
var fs = require("fs");
var https = require("https");
//var http = require("http");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Budgets = require('./Routers/Budgets.js');

app.use(session({secret:"softkitty", saveUninitialized:true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/Budgets", Budgets);
passport.use(new LocalStrategy(
  function(username, password, done) {
    UserRepository.LoginUser(username, password, function(err, user){
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
      if(req.params.bank){
        BankMetaDataRepository.GetAllUserBanks(req.user.username,function(err, bankAccessList){
          for(var i=0; i < bankAccessList.length; i++)
          {
            if(bankAccessList[i].bankName == req.params.bank)
            {
              return next();
            }
          }
          return res.redirect("/login.html");
        });
      }
      else
      {
        return next();
      }
    }
    else
    {
      return res.redirect("/login.html");
    }
  }

  app.all('/private/**', isAuthenticated)
  app.all('/V2/private/**', isAuthenticated)

app.use(express.static(__dirname + '/html/public'));
app.use('/private', express.static(__dirname + '/html/private'));
app.use('/V2', express.static(__dirname + '/v2'))
app.use('/V2/bower_components',express.static(__dirname + '/bower_components'));
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
  });


app.get('/logout', function(req, res) {
  req.logout();
  res.send("signed out")
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

app.post('/BankConfiguration', isAuthenticated, function(req, res){
  var userName = req.user.username;
  BankMetaDataRepository.UpdateBank(req.body, userName, function(err){
    if(err){
      res.status(400).send(err)
      return;
    }
    res.status(200).send(req.body)
  })


});

app.get('/categories/:bank', isAuthenticated, function(req, res){
  var bank = req.params.bank
  CategoriesRepository.GetList(bank, function(err, data){
    res.status(200).send(data);
  });
});

app.put('/categories/:bank', isAuthenticated, function( req,res){
  var bank = req.params.bank;
  CategoriesRepository.SaveToList(bank, req.body, function(err, data){
    res.send(200).send({status: "added"});
  })
});

app.get('/banks/:bank', isAuthenticated, function(req, res){
  var bank = req.params.bank
  BankRepository.GetDisplay(bank, req.query.PageNumber, req.query.StatusFilter, req.query.CategoryFilter, req.query.ShowFutureItems == "true", function(err, data){
    res.status(200).send(data);
  } );
})

app.get('/plans/:bank', isAuthenticated, function(req, res){
  var bank = req.params.bank
  PlanRepository.GetAll(bank, function(err, data){
    res.status(200).send(data);
  } );
} );


app.put("/Banks/:bank/users", isAuthenticated, function(req, res){
  req.on("data", function(stream){
    var trans = {};
    var myText = stream.toString();

    try{
      trans = JSON.parse(myText)
      BankMetaDataRepository.AddUser(req.params.bank,trans.username, req.user.username, function(err, data){
        if(err){
          res.status(400).send(err);
          return;
        }
        res.status(200).send(data);
      });
  }
    catch(ex){
      console.log(ex);
      res.status(400).send("f!");
    }

  })
});

app.get("/Banks/:bank/summary", isAuthenticated, function(req, res){
  BankRepository.GetSummary(req.params.bank, req.query.startDate, req.query.endDate, function(err,data){
    if(err != undefined && err != null){
      res.status(400).send("error getting data");
      return;
    }
    res.status(200).send(data)
  });
});

app.delete("/Banks/:bank/users/:username", isAuthenticated, function(req, res){

  BankMetaDataRepository.DeleteUser(req.params.bank,req.params.username, req.user.username, function(err, data){
    if(err){
      res.status(400).send(err);
      return;
    }
    res.status(200).send(data);
  });
});


app.post("/banks/:bank", isAuthenticated, function(req, res){
  var bank = req.params.bank;
  handleTransaction(req, res, bank);
});

app.put("/banks/:bank", isAuthenticated, function(req, res){
  var bank = req.params.bank;
  handleTransaction(req, res, bank);
});

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

app.delete("/banks/:bank", isAuthenticated, function(req, res){
  var bank = req.params.bank;
  console.log("deleting");
  BankRepository.DeleteTransactions(bank, function(err){
    if(err != undefined && err != null){
      res.status(400).send("error deleting transaction");
      return;
    }
    res.status(200).send("{'message':'deleted'}")
  });
});

function handleTransaction(req, res, bank){
 /* req.on("data", function(stream){
    var trans = {};
    var myText = stream.toString();
*/
    try{
  //    trans = JSON.parse(myText)
      var trans = req.body;
      var errs = Transaction.Validate(trans);
      if(errs.length > 0){
        res.status(400).send(errs);
        return;
      }
      if(trans.category != undefined && trans.category != "")
      {
        CategoriesRepository.SaveToList(bank, {"name":trans.category, "budget":0, "showAsProjection": false}, function(){});
      }
      BankRepository.AddTransaction(bank, trans, function(err){
        if(err != undefined && err != null){
          res.status(400).send("error adding transaction");
          return;
        }
        res.status(200).send('{"message":"saved"}');
      });
    }catch(ex){
      console.log(ex);
      res.status(400).send("bad")
      return;
    }
  /*}
);*/
}
app.delete("/Banks/:bank", isAuthenticated, function(req, res){
  BankMetaDataRepository.DeleteBank(req.params.bank, req.user.username, function(err){
    if(err){
      res.status(400).send("{message: 'failed'}")
      return;
    }
    res.status(200).send("{message: 'deleted'}");
  })
});

app.post("/Banks", isAuthenticated, function(req, res)
{
  req.on("data", function(stream){
    var bankData = {};
    var myText = stream.toString();

    try{
      bankData = JSON.parse(myText)
      BankMetaDataRepository.CreateBank(bankData.title,req.user.username,function(err){
        if(err){
          res.status(400).send("failed to save")
          return;
        }
        res.status(200).send(bankData.title)

      })
    }catch(ex){
      console.log(ex);
      res.status(400).send("bad")
      return;
    }

})
});
app.post("/plans/:bank", isAuthenticated, handlePlanTransaction);
app.put("/plans/:bank", isAuthenticated, handlePlanTransaction);

app.get("/bankplan/:bank", isAuthenticated,function(req, res){
  var bank = req.params.bank;
  if(req.query.startDate){
    GenerateBankPlan(req, res, bank,{"Transactions": []}, new Date(req.query.startDate));
    return;
  }
    else{
      GetBankPlan(req, res, bank);
    }
});

function GetBankPlan(req, res, bank){
  var startDate = new Date();
  startDate = (startDate.getMonth()+1)+"/"+startDate.getDate()+"/"+startDate.getFullYear();
  BankRepository.GetDisplay(bank, -1, "", "", true, function(err, bankData){
    GenerateBankPlan(req, res, bank, bankData, startDate);
  })
}

function GenerateBankPlan(req, res, bank, bankData, startDate){
  PlanRepository.GetAll(bank,function(err, planData){

    PlanRepository.PopulatePlan(startDate,req.query.Days,bankData, planData, function(err, data){
      res.status(200).send(data);
      return;
    });
  })
}
function handlePlanTransaction(req, res){
  var bank = req.params.bank;
  req.on("data", function(stream){
    var trans = {};
    var myText = stream.toString();
    try{
      trans = JSON.parse(myText)
      var errs = Transaction.StandardTransactionValidation(trans);
      if(!trans.id){
        trans.id = new Date().getTime()
      }
      if(errs.length > 0){
        res.status(400).send(errs);
        return;
      }

      PlanRepository.AddPlanItem(bank, trans, function(err){
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

app.get("/Users/:user/Permissions", isAuthenticated, function(req, res){
  UserRepository.GetUserPermissions(req.params.user,function(err, returnValue){
    if(err != undefined && err != null){
      res.status(400).send("error adding transaction");
      return;
    }
    res.status(200).send(returnValue)

  })


});

app.put("/Users", isAuthenticated, function(req, res){

  req.on("data", function(stream){
    var trans = {};
    var myText = stream.toString();
    try{
      user = JSON.parse(myText)

      if(user.username !== req.user.username){
        res.status(400).send("cannot update for this user");
        return;
      }

      UserRepository.UpdateUser(user.username, user.password,user.defaultBank, user.Pin, function(err, user){
        if(err) {
          res.status(400).send("error updating user");
          return;
        }
        res.status(200).send("user updated");
      });
    }catch(ex){
      console.log(ex);
      res.status(400).send(ex)
      return;
    }

  });
})

app.post("/Users", isAuthenticated, function(req, res){
  UserRepository.GetUserPermissions(req.user.username,function(err, returnValue){
    if(!returnValue.canCreateUser){
      res.status(400).send("error creating user");
      return;
    }
    req.on("data", function(stream){
      var trans = {};
      var myText = stream.toString();
      try{
        user = JSON.parse(myText)

        UserRepository.CreateUser(user.username, user.password,user.defaultBank, function(err, user){
          if(err) {
            res.status(400).send("error creating user");
            return;
          }
          res.status(200).send("user created");
        });
      }catch(ex){
        console.log(ex);
        res.status(400).send(ex)
        return;
      }

      });
    })
  });

app.post("/Transaction", function(req, res){
  UserRepository.ValidateUserPin( req.get("username"), req.get("signature"), "", function(err, data){
    if(err){
      res.status(400).send(err);
      return;
    }
    var bank = data.defaultBank;
    handleTransaction(req, res, bank);
});
});

var port = process.env.PORT;
if(process.argv[2])
{
    port = process.argv[2]
}
var privateKey = fs.readFileSync( './key.pem', 'utf8' );
var certificate = fs.readFileSync( './server.crt', 'utf8');

var server = https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(port, function (){
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
});
/*
var server = app.listen(8888, function () {

  var host = server.address().address
  var port = server.address().port


  console.log('Example app listening at http://%s:%s', host, port)
})*/

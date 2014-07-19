var testrunner = require("./testrunner.js");
var Planner = require("./Planner.js");

testrunner.PassOff = true;

testrunner.Test("Should validate repeating Transactions", function(){
    var errors = Planner.ValidateTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"day",  payee: "asdf", amount:100, type:"widthdrawl"})
    testrunner.Assert.IsEqual(0, errors.length);
});

testrunner.Test("Missing StartDate should cause Error", function(){
    var errors = Planner.ValidateTransaction({repeatInterval: 1, repeatUnit:"day",  payee: "asdf", amount:10, type:"widthdrawl"});
    testrunner.Assert.IsEqual(1, errors.length);
});

testrunner.Test("Missing repeatInterval should cause Error", function(){
    var errors = Planner.ValidateTransaction({startDate: "1/1/2000", payee: "asdf", amount:10, type:"widthdrawl"});
    testrunner.Assert.IsEqual(2, errors.length);
    
});

testrunner.Test("Should validate Payee", function(){
    var errors = Planner.ValidateTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"day", amount:10, type:"widthdrawl"});
    testrunner.Assert.IsEqual(1, errors.length);
    
    
});

testrunner.Test("Should validate Amount", function(){
    var errors = Planner.ValidateTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"day", payee:"asdf", type:"widthdrawl"});
    testrunner.Assert.IsEqual(1, errors.length);
    
    
});

testrunner.Test("Should validate amount(0)", function(){
    var errors = Planner.ValidateTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"day", amount:0, payee:"asdf", type:"widthdrawl"});
    testrunner.Assert.IsEqual(1, errors.length);
});

testrunner.Test("Requesting Transaction with ValidStartDate and number of days should return right plan", function(){
    var p = Planner.CreatePlan({Transactions: []})
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 2, repeatUnit:"day", payee: "everyOther", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 3, repeatUnit:"day", payee: "every3", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "1/6/2000", repeatInterval: 3, repeatUnit:"day", payee: "not", amount:100, type:"widthdrawl"});
    
    var pr = p.PopulatePlan(new Date("1/1/2000"), 5, {ActualBalance:0});
    testrunner.Assert.IsEqual(5, pr.transactions.length);
});

testrunner.Test("Requesting Transaction with ValidStartDate and number of days should return right plan (month)", function(){
    var p = Planner.CreatePlan({Transactions: []})
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"month", payee: "everyOther", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 2, repeatUnit:"month", payee: "every3", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "2/1/2001", repeatInterval: 3, repeatUnit:"month", payee: "not", amount:100, type:"widthdrawl"});
    
    var pr = p.PopulatePlan(new Date("1/1/2000"), 370, {ActualBalance:0});
    testrunner.Assert.IsEqual(20, pr.transactions.length);
});

testrunner.Test("running a plan should keep balance up to date", function(){
    var p = Planner.CreatePlan({Transactions: []})
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"month", payee: "everyOther", amount:100, type:"widthdrawl"});
   
    
    var pr = p.PopulatePlan(new Date("1/1/2000"), 1, {ActualBalance:200});
    testrunner.Assert.IsEqual(100, pr.transactions[0].balance.ActualBalance);
});

testrunner.Test("a plan that results in a negitive balance should return a warning", function(){
    var p = Planner.CreatePlan({Transactions: []})
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"month", payee: "everyOther", amount:100, type:"widthdrawl"});
   
    
    var pr = p.PopulatePlan(new Date("1/1/2000"), 1, {ActualBalance:0} );
    testrunner.Assert.IsEqual(1, pr.warnings.length);
});

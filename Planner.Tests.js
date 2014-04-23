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
    
    var transactions = p.PopulatePlan(new Date("1/1/2000"), 5);
    testrunner.Assert.IsEqual(5, transactions.length);
});

testrunner.Test("Requesting Transaction with ValidStartDate and number of days should return right plan (month)", function(){
    var p = Planner.CreatePlan({Transactions: []})
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 1, repeatUnit:"month", payee: "everyOther", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "1/1/2000", repeatInterval: 2, repeatUnit:"month", payee: "every3", amount:100, type:"widthdrawl"});
    p.AddTransaction({startDate: "2/1/2001", repeatInterval: 3, repeatUnit:"month", payee: "not", amount:100, type:"widthdrawl"});
    
    var transactions = p.PopulatePlan(new Date("1/1/2000"), 370);
    testrunner.Assert.IsEqual(20, transactions.length);
});

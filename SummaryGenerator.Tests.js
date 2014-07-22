var testrunner = require("./testrunner.js");
var Transaction = require("./Transaction.js");
var SummaryGenerator = require("./SummaryGenerator.js");


testrunner.Test("Should Add all Widthdrawls into TotalWithdrawls", function(){
    var trans = [{payee:'testPayee', date:'1/1/2013', amount:100.00, type:"widthdrawl"}];
    
    var generator = SummaryGenerator.CreateNewGenerator(trans)
    
    var summary = generator.Generate();
    
    testrunner.Assert.IsEqual(100.00, summary.TotalWithdrawls);
   
 });
 
 
 
testrunner.Test("Should Add all Widthdrawls into TotalDeposits", function(){
    var trans = [{payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"},
                 {payee:'testPayee', date:'1/1/2013', amount:100.00, type:"widthdrawl"}];
    
    var generator = SummaryGenerator.CreateNewGenerator(trans);
    
    var summary = generator.Generate();
    
    testrunner.Assert.IsEqual(100.00, summary.TotalDeposits);
   
 });
 
 testrunner.Test("Should show total gains", function(){
    var trans = [{payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"},
                 {payee:'testPayee', date:'1/1/2013', amount:90.00, type:"widthdrawl"}];
    
    var generator = SummaryGenerator.CreateNewGenerator(trans);
    
    var summary = generator.Generate();
    
    testrunner.Assert.IsEqual(10.00, summary.TotalGains);
   
 });
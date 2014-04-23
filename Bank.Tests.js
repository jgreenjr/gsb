var testrunner = require("./testrunner.js");
var Bank = require("./Bank.js");

testrunner.PassOff = true;
testrunner.Test("BankAccount should Set title from json",function(){
    var bankAccountJson = {title: "TestTitle"}
    var b = Bank.CreateBank(bankAccountJson);
    
    testrunner.Assert.IsEqual(b.Title(), "TestTitle");
    
});

testrunner.Test("Save Data Should Pass Backing Data",function(){
    var result = null;
    var bankAccountJson = {title: "TestTitle"}
   Bank.Saver = {SaveBank: function(data){ result = data;}};
   
   var b = Bank.CreateBank(bankAccountJson);
    b.Save();
    testrunner.Assert.IsEqual(result, bankAccountJson);
   
});

testrunner.Test("Adding Transaction Should Update Total Deposit", function(){
     var bankAccountJson = {title: "TestTitle"}
     var b = Bank.CreateBank(bankAccountJson);
    
    b.AddTransaction({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"})
    
    testrunner.Assert.IsEqual(b.Total(), 100.00);
})

testrunner.Test("Adding Transaction Should Update Total Withdrawl", function(){
     var bankAccountJson = {title: "TestTitle"}
     var b = Bank.CreateBank(bankAccountJson);
    
    b.AddTransaction({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"widthdrawl"})
    
    testrunner.Assert.IsEqual(b.Total(), -100.00);
})

testrunner.Test("Adding Transaction Should Update Total Deposit", function(){
     var bankAccountJson = {title: "TestTitle"}
     var b = Bank.CreateBank(bankAccountJson);
    
    b.AddTransaction({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"})
    
    testrunner.Assert.IsEqual(1, bankAccountJson.Transactions.length);
})

var testrunner = require("./testrunner.js");
var Bank = require("./Bank.js");

testrunner.PassOff = true;
testrunner.Test("BankAccount should Set title from json",function(){
    var bankAccountJson = {title: "TestTitle"}
    var b = Bank.CreateBank(bankAccountJson);
    
    testrunner.Assert.IsEqual(b.Title(), "TestTitle");
    
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

testrunner.Test("Adding Transaction Should Update Total Deposit", function(){
     var bankAccountJson = {title: "TestTitle"}
     var b = Bank.CreateBank(bankAccountJson);
    
    b.AddTransaction({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"})
    b.AddTransaction({payee:'testPayee', date:'2/1/2013', amount:100.00, type:"deposit"})
    b.AddTransaction({payee:'testPayee', date:'1/1/2012', amount:100.00, type:"deposit"})
    
    testrunner.Assert.IsEqual('2/1/2013', bankAccountJson.Transactions[0].date);
     testrunner.Assert.IsEqual('1/1/2013', bankAccountJson.Transactions[1].date);
      testrunner.Assert.IsEqual('1/1/2012', bankAccountJson.Transactions[2].date);
})

testrunner.Test("Adding Transaction Should Update Total Deposit", function(){
     var bankAccountJson = {title: "TestTitle",Total: 75, Transactions:[{payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"},{payee:'testPayee', date:'1/1/2013', amount:25.00, type:"widthdrawl"}]}
     var b = Bank.CreateBank(bankAccountJson);
    
    testrunner.Assert.IsEqual(bankAccountJson.Transactions[0].balance,75)
    testrunner.Assert.IsEqual(bankAccountJson.Transactions[1].balance,-25)
});

testrunner.Test("Updating Transaction Should Update transaction", function(){
     var bankAccountJson = {title: "TestTitle",Total: 75, Transactions:[{payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit", id:"1"},{payee:'testPayee', date:'1/1/2013', amount:25.00, type:"widthdrawl", id:"2"}]}
     var updatedTransaction2 = {payee:'asdfasdf', date:'1/1/2013', amount:25.00, type:"widthdrawl", id:"2"};
     var b = Bank.CreateBank(bankAccountJson);
    
    b.UpdateTransaction(updatedTransaction2);
    
    testrunner.Assert.IsEqual(bankAccountJson.Transactions[1].payee,"asdfasdf");
    
})


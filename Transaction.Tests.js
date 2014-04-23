var testrunner = require("./testrunner.js");
var Transaction = require("./Transaction.js");


testrunner.Test("Should Return Valid for Valid Deposit", function(){
    var messages = Transaction.Validate({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"deposit"})
    testrunner.Assert.IsEqual(0, messages.length);
})

testrunner.Test("Should Return  InValid for invalid amount", function(){
    var messages = Transaction.Validate({payee:'testPayee', date:'01/01/2013', amount:0.00, type:"deposit"});
    
    testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Amount", messages[0].message)
})

testrunner.Test("Should Return  InValid for invalid amount", function(){
    var messages = Transaction.Validate({payee:'testPayee', date:'01/01/2013', type:"deposit"});
    
    testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Amount", messages[0].message)
})

testrunner.Test("Should Return  InValid for invalid amount", function(){
    var messages = Transaction.Validate({payee:'testPayee', date:'01/01/2013', type:"deposit", amount:"asdf"});
    
    testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Amount", messages[0].message)
})

testrunner.Test("Should Return  InValid for invalid type", function(){
    var messages = Transaction.Validate({payee:'testPayee', date:'1/1/2013', amount:100.00, type:"asdf"});
    
     testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Type", messages[0].message)
})

testrunner.Test("Should Return  InValid for invalid Date", function(){
       var messages = Transaction.Validate({payee:'testPayee', date:'asdf', amount:100.00, type:"widthdrawl"});
    
     testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Date", messages[0].message)
})

testrunner.Test("Should Return Invalid for Invalid Payee", function(){
    var messages = Transaction.Validate({payee:'', date:'1/1/2013', amount:100.00, type:"deposit"})
    testrunner.Assert.IsEqual(1, messages.length);
    testrunner.Assert.IsEqual("Invalid Payee", messages[0].message);
})
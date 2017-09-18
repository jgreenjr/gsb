var BankService = require('../Services/BankService.js')
var async = require('async');
var OldBankJson = require('./oldbankjson.json');
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/gsb');
var ObjectId = require('mongoose').Schema.ObjectId;
console.log('importing GSB Transactions');
console.log('transactionCount: ', OldBankJson.Transactions.length);
console.log('bankid', OldBankJson.BankId);

var catCount = 0; 

BankService.GetAll(OldBankJson.UserId, function(err, banks){
    console.log(banks);
    BankService.Get(banks[0]._id,OldBankJson.UserId, function(err, bank){
    if(!bank){
        console.log("doh")
        return;
    }
   async.eachSeries(OldBankJson.Transactions, function(ot, done)   {
     var trans = {bankId:banks[0]._id};
        trans.Payee = ot.payee;
        if (ot.type == 'widthdrawl') {
            trans.Type='withdrawal';
        }
        else {
            trans.Type = "deposit";
        }
            
        trans.Date = new Date(ot.date);
        trans.Amount = ot.amount;
        trans.Status = ot.Status;
        trans.Bank = trans.bankId;
        trans.FollowUp = ot.TipNeeded|false;
        trans.PlannedTransactionId = ot.id; 
        trans.Category = ot.category;
       // console.log(trans)
        BankService.AddTransaction(trans, function(err, trans){
            console.log("did it:", trans._id);
            done();
        })
    });


});
});

/*BankService.Get(new ObjectId(OldBankJson.BankId), new ObjectId(OldBankJson.UserId), function(err, bank){
    if(!bank){
        console.log("doh")
        return;
    }
    async.eachSeries(OldBankJson.Transactions, function(ot, done){
        BankService.UpdateCategoryList(bank,ot.category, done);
    })
})*/
//async.each()

/*async.each(OldBankJson.Transactions, function(ot)   {
     var trans = {bankId: process.argv[2]};
        trans.Payee = ot.payee;
        if (ot.type == 'widthdrawl') {
            trans.Type='withdrawal';
        }
        else {
            trans.Type = "deposit";
        }
            
        trans.Date = new Date(ot.date);
        trans.Amount = ot.amount;
        trans.Status = ot.Status;
        trans.Bank = trans.bankId;
        trans.FollowUp = ot.TipNeeded|false;
        trans.PlannedTransactionId = ot.id; 
        trans.Category = ot.category;
       // console.log(trans)
        BankService.AddTransaction(trans, function(err, trans){
            console.log("did it");
        })
    });


*/
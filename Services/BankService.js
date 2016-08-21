var ObjectId = require('mongoose').Schema.ObjectId,
    _ = require('lodash');

module.exports = function (Bank, TransactionModel, BankCalculatorService){
    return{
        GetAll: function(userId, callback){

            if(userId){
                return Bank.find({'Users.UserId':userId}, function(err, data){
                    if(err){
                        callback(err);
                    }
                    else if(!data){
                        callback({message: 'No data found'});
                    }
                    else{
                        var returnValue = _.map(data,function(a){
                            return {bankId: a._id, Name: a.Name};
                        });

                        callback(null, returnValue);
                    }
                });
            }

            return callback({errorCode: 400, message: "Must send UserId"});
        },
        Get: function(bankId, userId, cb) {
            if (!bankId) {
                return cb({errorCode: 400, "message": "Must send BankId"});
            }
            else if (!userId)
            {
                return callback({errorCode: 400, message: "Must send UserId"});
            }

            return Bank.findOne({'_id':bankId, 'Users.UserId': userId}, function(err, bank){
                if(err){
                    return cb(err);
                }
                else if(!bank){
                    return cb({message: "BankID UserId set incorrect"});
                }

                TransactionModel.find({'Bank': bankId})
                    .sort({'Date':'1','Order':1})
                    .exec(function(err, data){
                        var bcs = new BankCalculatorService();
                        var returnData = bcs.CalculateBalances(data);

                        var bankReturn = {
                            Title: bank.Name,
                            Transaction: returnData,
                            Balances: bcs.Balances
                        };
                        return cb(null, bankReturn);
                    });
            });
        },
        Create: function(bankName, userId, cb){
            var bank = new Bank();
            bank.Name = bankName;

            var bankUser = {
                UserId: userId,
                IsOwner: true
            };

            bank.Users.push(bankUser);

            bank.save(cb);
        },
        AddTransaction: function(bankId, transactionData, callback){
            CheckForBank(bankId, callback, function(){
                var transaction = new TransactionModel();
                transaction.Payee = transactionData.Payee;
                transaction.Type = transactionData.Type;
                transaction.Date = transactionData.Date;
                transaction.Amount = transactionData.Amount;
                transaction.Status =  transactionData.Status;
                transaction.Bank = bankId;
                transaction.Note = transactionData.Note;
                transaction.FollowUp = transactionData.FollowUp;

                transaction.save(function(err, data){
                    return callback(err, data);
                });
            });
        }
    };
    function CheckForBank(BankId, callback,next){
        Bank.findOne({'_id': BankId}, function(err, bank){
            if(err  || bank === null)
                return callback("bank not found");
            next();
        });
    }
};

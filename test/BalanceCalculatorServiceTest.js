var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

function MakeTransaction(balance, type, status) {

    return {
        'Amount': balance,
          'Type': type,
            'Status': status
    };
}
describe('BalanceCalculatorService', function() {
    var BalanceCalculatorService =  require("../Services/BalanceCalculatorService.js");
    describe('SumActualBalances', function(){

        it('should append balance regardless to each transaction', function(){
            var trans =[];

            trans.push(MakeTransaction(10, 'Deposit', 'Pending' ));
            trans.push(MakeTransaction(9, 'Withdrawl', 'Pending' ));
            expect(BalanceCalculatorService).to.not.be.null;
            var bcs = new BalanceCalculatorService();
            var result = bcs.CalculateBalances(trans);
            assert.equal(2, result.length);
            assert.equal(10, result[0].Balance.ActualBalance);
            assert.equal(1, result[1].Balance.ActualBalance);
        });

        it('should append balance for only cleared to each transaction', function(){
            var trans =[];

            trans.push(MakeTransaction(10, 'Deposit', 'Pending' ));
            trans.push(MakeTransaction(9, 'Withdrawl', 'Cleared' ));
            expect(BalanceCalculatorService).to.not.be.null;
            var bcs = new BalanceCalculatorService();
            var result = bcs.CalculateBalances(trans);
            assert.equal(2, result.length);
            assert.equal(0, result[0].Balance.CurrentBalance);
            assert.equal(-9, result[1].Balance.CurrentBalance);
        });


        it('should have correct final totals for only cleared to each transaction', function(){
            var trans =[];

            trans.push(MakeTransaction(10, 'Deposit', 'Pending' ));
            trans.push(MakeTransaction(9, 'Withdrawl', 'Cleared' ));
            expect(BalanceCalculatorService).to.not.be.null;
            var bcs = new BalanceCalculatorService();
            var result = bcs.CalculateBalances(trans);
            expect(bcs.Balances.CurrentBalance).to.be.equal(-9);
            expect(bcs.Balances.ActualBalance).to.be.equal(1);
        });

        it('should always fail', function(){
            expect(false).to.be.true();
        });
    });
});


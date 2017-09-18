/**
 * Created by greenj on 8/23/16.
 */
var chai = require('chai');
var expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

describe('BudgetCalculatorService', function () {
    it('Should Add when in action is added', function () {
        var budget = {
            Budgets: [
                {
                    Name: 'test123',
                    Actions: [
                        {
                            Type: 'In',
                            Amount: 100
                        }],
                    Transactions: []
                }
            ]
        };

        var BudgetCalculatorService = require('../Services/BudgetCalculatorService.js')();
        BudgetCalculatorService.Calculate(budget, []);
        expect(budget.Budgets[0].balance.totalIn).to.equal(100, 'TotalIn');
        expect(budget.Budgets[0].balance.difference).to.equal(100, 'Difference');
    });
    it('Should Add when in action is added', function () {
        var budget = {
            Budgets: [
                {
                    Name: 'test123',
                    Actions: [
                        {
                            Type: 'In',
                            Amount: 100
                        },
                        {
                            Type: 'Out',
                            Amount: 100
                        },
                        {
                            Type: 'Out',
                            Amount: 100
                        }
                    ],
                    Transactions: []
                }
            ]
        };

        var BudgetCalculatorService = require('../Services/BudgetCalculatorService.js')();
        BudgetCalculatorService.Calculate(budget, []);
        expect(budget.Budgets[0].balance.totalIn).to.equal(100);
        expect(budget.Budgets[0].balance.totalOut).to.equal(200);
        expect(budget.Budgets[0].balance.difference).to.equal(-100);
    });
    it('Should Add when in transaction is added', function () {
        var budget = {
            Budgets: [
                {
                    Name: 'test123',
                    Type: 'Income',
                    budgeted: 100,
                    Actions: [],
                    Transactions: [
                        {TransactionId: '12345',
                            Percentage: 0.50},
                        {TransactionId: '12346',
                            Percentage: 1},
                        {TransactionId: '12357',
                            Percentage: 0.50}
                    ]
                }
            ]
        };

        var BudgetCalculatorService = require('../Services/BudgetCalculatorService.js')();
        BudgetCalculatorService.Calculate(budget, [
            {
                _id: '12345',
                Amount: 100,
                Type: 'deposit'
            },
            {
                _id: '12346',
                Amount: 100,
                Type: 'withdrawal'
            },
            {
                _id: '12357',
                Amount: 100,
                Type: 'withdrawal'
            }
        ]);
        expect(budget.Budgets[0].balance.totalIn).to.equal(50);
        expect(budget.Budgets[0].balance.totalOut).to.equal(150);
        expect(budget.Budgets[0].balance.difference).to.equal(-100);
        expect(budget.summary.income.budgeted).to.equal(100);
        expect(budget.summary.income.current).to.equal(50);
    });
});

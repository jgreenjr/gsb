const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
chai.use(spies);

describe('BudgetService', function () {
    it('ShouldGetAllBudgetSheetsForUser', function () {
        var BudgetService = require('../Services/BudgetService.js')(
            {
                find: function (filter, callback) {
                    return callback(null, [{
                        _id: 'id12345',
                        Name: 'test12345',
                        UserId: '123456',
                        StartDate: '1/1/2001',
                        EndDate: '1/1/2001',
                        Budgets: [{}]
                    }]);
                }
            });

        BudgetService.GetAllBudgetSheets('123', function (err, data) {
            expect(err).to.equal(null)
            expect(data.length).to.be.equal(1);
            expect(data[0].Name).to.be.equal('test12345', 'Name');
            expect(data[0].BudgetSheetId).to.be.equal('id12345', 'BudgetSheetId');
        });
    });

    describe('AddActionToBudget', function () {
        it('should return an error when trying to add a action to bank with no data', function () {
            var BudgetService = require('../Services/BudgetService.js')({
                findOne: function (filter, callback) {
                    return callback(null, null);
                }
            });
            var testFunction = function (err) {
                expect(err).to.not.equal(null);
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddActionToBudget('1234', '1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });

        it("should return an error when to add a action to budget that doesn't exist", function () {
            var BudgetService = require('../Services/BudgetService.js')({

                findOne: function (filter, callback) {
                    return callback(null, {
                        _id: 'id12345',
                        Name: 'test12345',
                        UserId: '123456',
                        StartDate: '1/1/2001',
                        EndDate: '1/1/2001',
                        Budgets: [{}]
                    });
                }
            });
            var testFunction = function (err) {
                expect(err).to.not.equal(null);
                expect(err.Error).to.equal('Budget Not Found');
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddActionToBudget('1234', '1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });

        it('should add to action', function () {
            var BudgetService = require('../Services/BudgetService.js')({

                findOne: function (filter, callback) {
                    return callback(null, {
                        _id: 'id12345',
                        Name: 'test12345',
                        UserId: '123456',
                        StartDate: '1/1/2001',
                        EndDate: '1/1/2001',
                        Budgets: [{_id: '1234', Actions: []}],
                        save: function (callback) {
                            return callback(null, {});
                        }
                    });
                }

            });
            var testFunction = function (err, data) {
                expect(err).to.equal(null);
                expect(data).to.not.equal(null);
                expect(data.Message).to.equal('Action Added');
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddActionToBudget('1234', '1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });
    });
    describe('AddTransactionToBudget', function () {
        it('should return an error when trying to add a action to bank with no data', function () {
            var BudgetService = require('../Services/BudgetService.js')({

                findOne: function (filter, callback) {
                    return callback(null, null);
                }

            });
            var testFunction = function (err) {
                expect(err).to.not.equal(null);
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddTransactionToBudget('1234', '1234', '1234', '1234', spy);
            expect(spy).to.have.been.called();
        });

        it("should return an error when to add a action to budget that doesn't exist", function () {
            var BudgetService = require('../Services/BudgetService.js')({
                findOne: function (filter, callback) {
                    return callback(null, {
                        _id: 'id12345',
                        Name: 'test12345',
                        UserId: '123456',
                        StartDate: '1/1/2001',
                        EndDate: '1/1/2001',
                        Budgets: [{}]
                    });
                }
            });
            var testFunction = function (err) {
                expect(err).to.not.equal(null);
                expect(err.Error).to.equal('Budget Not Found');
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddActionToBudget('1234', '1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });

        it('should add to action', function () {
            var BudgetService = require('../Services/BudgetService.js')({
                findOne: function (filter, callback) {
                    return callback(null, {
                        _id: 'id12345',
                        Name: 'test12345',
                        UserId: '123456',
                        StartDate: '1/1/2001',
                        EndDate: '1/1/2001',
                        Budgets: [{_id: '1234', Transactions: []}],
                        save: function (callback) {
                            return callback(null, {});
                        }
                    });
                }
            });
            var testFunction = function (err, data) {
                expect(err).to.equal(null);
                expect(data).to.not.equal(null);
                expect(data.Message).to.equal('Transaction Added');
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddTransactionToBudget('1234', '1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });
    });
    describe('AddBudget', function () {
        it('should return an error when trying to add a action to bank with no data', function () {
            var BudgetService = require('../Services/BudgetService.js')({

                findOne: function (filter, callback) {
                    return callback(null, null);
                }

            });
            var testFunction = function (err) {
                expect(err).to.not.equal(null);
            };

            var spy = chai.spy(testFunction);

            BudgetService.AddBudget('1234', '1234', {}, spy);
            expect(spy).to.have.been.called();
        });

        it('should add budget', function () {
            var BudgetService = require('../Services/BudgetService.js')({
                findOne: function (filter, callback) {
                    return callback(null, {
                        Budgets: [],
                        save: function (callback) {
                            return callback(null, {});
                        }
                    });
                }
            });
            var testFunction = function (err, message) {
                expect(err).to.equal(null);
                expect(message).to.not.equal(null);
                expect(message.Message).to.equal('Budget Added');
            };

            var spy = chai.spy(testFunction);
            BudgetService.AddBudget('1234', '1234', {}, spy);

            expect(spy).to.have.been.called();
        });
    });

    describe('TransferBetweenBudgets', function () {
        it('should add action to both budgets', function () {
            var budget = {
                Budgets: [
                    {
                        _id: '1234',
                        Actions: []
                    },
                    {
                        _id: '1235',
                        Actions: []
                    },
                    {
                        _id: '1236',
                        Actions: []
                    }
                ],
                save: function (cb) {
                    return cb(null, {});
                }
            };

            var BudgetService = require('../Services/BudgetService.js')({
                findOne: function (filter, callback) {
                    return callback(null, budget);
                }
            });

            var testFunction = function (err, message) {
                expect(err).to.equal(null);
                expect(message).to.not.equal(null);
                expect(message.Message).to.equal('Transfer Added');

                expect(budget.Budgets[0].Actions.length).to.equal(1);
                expect(budget.Budgets[1].Actions.length).to.equal(1);
                expect(budget.Budgets[2].Actions.length).to.equal(0);
            };

            var spy = chai.spy(testFunction);
            BudgetService.TransferBetweenBudgets('1234', '1234', '1234', '1235', 100, spy);

            expect(spy).to.have.been.called();
        });
    });
});
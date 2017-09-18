var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlannedTransaction = new Schema({
    Payee: String,
    Amount: Number,
    Type: String,
    StartDate: Date,
    RepeatUnit: String,
    RepeatFrequency: Number,
    Active: Boolean,
    Category: String
});

var plan = new Schema({
    Name: String,
    PlannedTransactions: [PlannedTransaction],
    UserId: String,
    AutoPopulate: {type: Boolean, default: false}
});

module.exports = mongoose.model('plan', plan);
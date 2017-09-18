/**
 * Created by greenj on 8/13/16.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Transaction = new Schema({
    Payee: { type: String, required: true },
    Type: { type: String, required: true },
    Date: { type: Date, required: true },
    Amount: { type: Number, required: true },
    Status: { type: String, required: true },
    Bank: { type: ObjectId, ref: 'Bank' },
    Note: String,
    FollowUp: Boolean,
    Order: { type: Number, required: true },
    PlannedTransactionId: String,
    Category: String
});

Transaction.plugin(autoIncrement.plugin, { model: 'Transaction', field: 'Order' });

module.exports = mongoose.model('Transaction', Transaction);
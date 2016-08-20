/**
 * Created by greenj on 8/13/16.
 */
var mongoose = require("mongoose"),
    autoIncrement = require("mongoose-auto-increment");

var db = mongoose.createConnection("mongodb://localhost/gsb")
autoIncrement.initialize(db);
var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

var Transaction = new Schema({
    Payee: {type: String, required: true},
    Type: {type: String, required: true},
    Date: {type: Date, required: true},
    Amount: {type: Number, required: true},
    Status: {type: String, required: true},
    Bank: {type: ObjectId, ref: 'Bank'},
    Note: String,
    FollowUp: Boolean,
    Order: {type: Number, required:true}
});

Transaction.plugin(autoIncrement.plugin, {model: 'Transaction', field: 'Order'});

module.exports = db.model('Transaction',Transaction);
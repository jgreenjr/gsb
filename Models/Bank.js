/**
 * Created by greenj on 8/14/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BankUser = new Schema({
    UserId: ObjectId,
    IsOwner: Boolean
});

var Category = new Schema({
    CategoryId: {Type: Number},
    Text: String,
    Type: String,
    Active:{type: Boolean, default: true},
    Amount: {type: Number, required: true, default: 0}
});

var Bank = new Schema({
    Name: String,
    Users: [BankUser],
    Categories: [Category]
});

module.exports = mongoose.model('Bank', Bank);
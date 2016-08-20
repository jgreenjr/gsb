/**
 * Created by greenj on 8/14/16.
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/gsb');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BankUser = new Schema({
    UserId: ObjectId,
    IsOwner: Boolean
})

var Bank = new Schema({
    Name: String,
    Users: [BankUser]
});

module.exports =  db.model('Bank', Bank);
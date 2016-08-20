/**
 * Created by greenj on 8/14/16.
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/gsb');


var BankUser = new Schema({
    UserId: ObjectId,
    IsOwner: Boolean
});

module.exports =  db.model('BankUser', Bank);
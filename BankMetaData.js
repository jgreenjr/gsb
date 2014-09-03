exports.MetaDataBuilder = function(data){
    var backingData = data;
    
    this.GetBanks = function(username){
        var banks = [];
        
        for(var i = 0; i < backingData.length; i++){
           if(this.containsUser(backingData[i],username))
        {
            banks.push({bankName: backingData[i].title})
        }
       
    }
     return banks;
}

 this.GetBanksFullDetail = function(username){
        var banks = [];
        
        for(var i = 0; i < backingData.length; i++){
           if(this.containsUser(backingData[i],username))
        {
            banks.push(backingData[i])
        }
       
    }
     return banks;
}


this.checkUser = function (bankname, username){
     for(var i = 0; i < backingData.length; i++){
           if(backingData[i].title == bankname && this.containsUser(backingData[i],username))
        {
           return true;
        }
     }
     return false;
}

this.containsUser = function(bank, username){
     for(var j = 0; j< bank.users.length; j++){
                if(bank.users[j] == username){
                  return true;
                    
            }
        }
    return false;
}
return this;
}


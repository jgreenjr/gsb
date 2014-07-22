exports.CreateNewGenerator = function(trans){
    this.StartDate = undefined;
    this.EndDate = undefined;
    
    this.trans = trans;
    
    this.Generate = function(){
        var tw = 0;
        var td = 0;
        var tg = 0;
        for(var i = 0; i < trans.length; i++){
            switch(trans[i].type){
                case "widthdrawl":
                    tw += trans[i].amount;
                    break;
                case "deposit":
                    td += trans[i].amount;
                    break;
            }
        }
        
        return {
            date: Date.now(),
            TotalWithdrawls:tw,
            TotalDeposits: td,
            TotalGains: td-tw
        };
    }
    
    return this;
}
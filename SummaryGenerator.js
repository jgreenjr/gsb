exports.CreateNewGenerator = function(trans){
    
    this.trans = trans;
    
    this.Generate = function(startDate){
        
        var tw = 0;
        var td = 0;
        var tg = 0;
        var twc = 0;
        var tdc = 0;
        var tc = 0;
        for(var i = 0; i < trans.length; i++){
            if(!startDate ||trans[i].date >= startDate){
                tc++;
            switch(trans[i].type){
                case "widthdrawl":
                    twc++
                    tw += parseInt(trans[i].amount);
                    break;
                case "deposit":
                    tdc++;
                    td +=  parseInt(trans[i].amount);
                    break;
            }
            }
        }
        
        return {
            date:new Date().toDateString(),
            TotalWithdrawls:tw,
            TotalWithdrawlsCount: twc,
            TotalDeposits: td,
            TotalDepositsCount: tdc,
            TotalGains: td-tw,
            TotalTransactions: tc
        };
    }
    
    return this;
}
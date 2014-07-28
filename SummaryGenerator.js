exports.CreateNewGenerator = function(trans, catManager){
    console.log(catManager)
    this.trans = trans;
    
    
    this.Generate = function(startDate, cm){
        
        var tw = 0;
        var td = 0;
        var tg = 0;
        var twc = 0;
        var tdc = 0;
        var tc = 0;
        
        var byCategory = cm.GetSummaryArray();
        
        
        for(var i = 0; i < trans.length; i++){
            var amount = parseInt(trans[i].amount);
            if(!startDate ||trans[i].date >= startDate){
                tc++;
            switch(trans[i].type){
                case "widthdrawl":
                    twc++
                    
                    tw += amount
                    AddCategory(trans[i].category, amount, byCategory, false);
                    break;
                case "deposit":
                    tdc++;
                    td += amount
                    
                    AddCategory(trans[i].category, amount, byCategory, true);
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
            TotalTransactions: tc,
            ByCategory: byCategory
        };
    }
    
    function AddCategory(category, amount, obj, isDeposit){
        
        if(!isDeposit)
            amount*= -1;
           
        for(var i = 0; i< obj.length; i++)
        {
            if(obj[i].category == category){
                obj[i].total += amount;
                obj[i].count+= 1;
                return;
            }
        }
        
        obj.push({category:category, total:amount, count: 0});
        
    }
    
    return this;
}
exports.UpdateTotal = function(currentTotal, transaction)
{
    if(!currentTotal.ClearedBalance)
        currentTotal.ClearedBalance = 0
        
    var includeInCleared = transaction.Status == "Cleared"|| transaction.Status == "Closed";
     switch(transaction.type){
            case "deposit":
                if(!transaction.IsFutureItem)
              {
                  currentTotal.ActualBalance = currentTotal.ActualBalance + parseFloat(transaction.amount);
              }
              else
                {
                    
                    if(!currentTotal.FutureBalance){
                        currentTotal.FutureBalance = currentTotal.ActualBalance;
                    }
                    currentTotal.FutureBalance = currentTotal.FutureBalance + parseFloat(transaction.amount);
                }
              if(includeInCleared)
                currentTotal.ClearedBalance = currentTotal.ClearedBalance + parseFloat(transaction.amount);
                
              break;
              case "widthdrawl":
                if(!transaction.IsFutureItem)
              {
              currentTotal.ActualBalance = currentTotal.ActualBalance - parseFloat(transaction.amount);
              }
               else
                {
                    
                   
                    if(!currentTotal.FutureBalance){
                        currentTotal.FutureBalance = currentTotal.ActualBalance;
                    }
                    currentTotal.FutureBalance = currentTotal.FutureBalance - parseFloat(transaction.amount);
                }
              if(includeInCleared)
                currentTotal.ClearedBalance = currentTotal.ClearedBalance - parseFloat(transaction.amount);
              break;
        }
        return currentTotal;
}

exports.CopyTotal = function(source){
    return {ActualBalance: source.ActualBalance, ClearedBalance: source.ClearedBalance, FutureBalance:source.FutureBalance};
}
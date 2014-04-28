exports.UpdateTotal = function(currentTotal, transaction)
{
     switch(transaction.type){
            case "deposit":
              currentTotal = currentTotal + parseFloat(transaction.amount);
              break;
              case "widthdrawl":
              currentTotal = currentTotal - parseFloat(transaction.amount);
              break;
        }
        return currentTotal;
}

/**
 * Created by greenj on 7/3/15.
 */
app.controller("BankController",["SharedDataService","$http",function(SharedDataService,$http){
    this.showCurrent = false;
    this.pending = true;
    this.cleared = true;

    parent = this;
    this.SwitchShowCurrent = function(){
        this.showCurrent = !this.showCurrent;
    }

    this.showPending = function() {
        this.pending = !this.pending;

    }
    this.showCleared = function(){
            this.cleared = !this.cleared;
    }

    this.filteredTransactions = function(transaction){
        return (transaction.Status == "Cleared" && parent.cleared)||
            (transaction.Status == "Pending" && parent.pending)
    }

    this.UpdateStatus = function(transaction){
        if(transaction.Status != 'Cleared' ) {
            transaction.Status = 'Cleared'
        }
    }

    this.ShowStatusDialog = function(){
        $("#statusFilterModal").modal();
    }

    SharedDataService.watcher = function(data){
        parent.selectedBank = data.selectedBank;
        parent.GetTransactions();
    }
    this.UpdateTransaction = function(){

    }

    this.GetTransactions = function(){
        var settings =  {method: 'get',
            url: '/banks/'+ this.selectedBank+"?PageNumber=1&StatusFilter=&CategoryFilter=&ShowFutureItems=true",
            headers: {
            'bank':this.selectedBank
            }
        }

        $http(settings).success(function(data){
            parent.Transactions = data.Transactions;
            parent.Total = data.Total;
        }).error(function(arg1, arg2){
            console.log(arg1);
            console.log(arg2);
        });
    }
}]);

app.filter('statusCheckMark', function() {
    return function(input) {
        return input == 'Cleared' ? '\u2713' : '\u2718';
    };
});

var bankResponse = {"Transactions":[{"payee":"test transaction 4","date":"6/17/2015","amount":"44.22","type":"widthdrawl","Status":"Pending","InsertDate":"2015-06-17 14:17:11","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_17_11_369","balance":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 3","date":"6/17/2015","amount":"55.27","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:59","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_59_410","balance":{"ActualBalance":744.73,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 2","date":"6/17/2015","amount":"200.00","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:44","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_44_581","balance":{"ActualBalance":800,"ClearedBalance":-200,"FutureBalance":0}},{"payee":"asdf","date":"6/17/2015","amount":"1000.00","type":"deposit","Status":"Pending","InsertDate":"2015-06-17 14:16:32","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_32_728","balance":{"ActualBalance":1000,"ClearedBalance":0,"FutureBalance":0}}],"Total":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}};

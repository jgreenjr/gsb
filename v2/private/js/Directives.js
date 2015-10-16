/**
 * Created by greenj on 6/27/15.
 */
app.directive("menuBar", ["$http", "$cookies", "FilterService", function($http,$cookies, FilterSerivce){
    return {
        restrict:"E",

        "templateUrl":"directives/menu-bar.html",
        controller: function($scope, DataShareService){

            $scope.filters = FilterSerivce.filters;

            $scope.menuBarData = {username: "asdf", banks: []};
            $http.get("/banks").success(function(data){
                $scope.menuBarData = data;

                for(var i = 0; i < data.banks.length; i++){
                    //alert(data.banks[i].bankName == $cookies.defaultBank);
                    if(data.banks[i].bankName == $cookies.defaultBank){
                        $scope.menuBarData.selectedBank = $cookies.defaultBank;
                        DataShareService.selectedBankUpdated(data.banks[i]);
                        return;
                    }
                }

            });

            this.updateDisplay = function(type){
                switch(type){
                    case "showPending":
                        $scope.filters.showPending = !$scope.filters.showPending;
                        FilterSerivce.updateShowPending($scope.filters.showPending);
                        return false;
                    case "showCleared":
                        $scope.filters.showCleared = !$scope.filters.showCleared;
                        FilterSerivce.updateShowCleared($scope.filters.showCleared);
                        return false;
                    case "showFutureItems":
                        $scope.filters.showFutureTransaction = !$scope.filters.showFutureTransaction;
                        if($scope.filters.showFutureTransaction)
                        {
                            $scope.filters.showNextSevenDays = false;
                        }

                        FilterSerivce.updateAllFilterSettings($scope.filters);
                        break;

                    case "showNextSevenDays":
                        $scope.filters.showNextSevenDays = !$scope.filters.showNextSevenDays;
                        if($scope.filters.showNextSevenDays)
                        {
                            $scope.filters.showFutureTransaction = false;
                        }

                        FilterSerivce.updateAllFilterSettings($scope.filters);
                        break;
                    case "showNeedsTip":
                        $scope.filters.showNeedsTips = !$scope.filters.showNeedsTips;
                        FilterSerivce.updateAllFilterSettings($scope.filters);
                        break;
                    case "showBudgetItems":
                        $scope.filters.showBudgetItems = !$scope.filters.showBudgetItems;
                        FilterSerivce.updateAllFilterSettings($scope.filters);
                        break;
                    case "showCurrentBalance":
                        $scope.filters.showCurrentBalance = !$scope.filters.showCurrentBalance;
                        FilterSerivce.updateAllFilterSettings($scope.filters);
                        break;
                }
                return false;
            }

            this.UpdateBankName = function(bankName){
                $scope.menuBarData.selectedBank = bankName.bankName;
                DataShareService.selectedBankUpdated( bankName);

            }

            $scope.OpenPopulatorWindow = function(){
               $("#planPopulatorModal").modal();
            }

            this.AddTransaction = function(){
                var currentDate = new Date();

                var dateStr = (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear();
                DataShareService.selectedTransactionUpdated({date: dateStr, Status:'Pending', type:'widthdrawl' })
                $("#transactionModal").modal();
                return false;
            }

            $scope.UpdateSearchQuery = function(){

                FilterSerivce.updateFilterSetting("searchQuery", $scope.searchQuery);
                return false;
            }
        },
        controllerAs: "menuCtrl",
        link: function(scope, element, attrs) {
             if (attrs.activeMenuItem) {
                scope.activeMenuItem = attrs.activeMenuItem;
            }
        },
    };
}]);

app.directive('transactionBalance', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-balance.html'
    };
});

app.directive("statusFilters", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/Status-Filters.html'
    };
})

app.directive("accountSummary", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/account-summary.html'
    };
})

app.directive("transactionEditor", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-editor.html',
        //template: "<div>{{transactionObject.payee}}</div>",

        controller: function($scope, $http, DataShareService,TransactionSaveService){
            $scope.transactionObject = {};
                $scope.$on('selectedTransactionUpdated', function() {
                $scope.transactionObject = DataShareService.selectedTransaction;
            });

            $scope.$on('categoryDataUpdated', function(){
               $scope.Categories = DataShareService.categoryData;

            });

            this.SaveTransaction = function(){
                TransactionSaveService.SaveTransaction(DataShareService.selectedBank, $scope.transactionObject)
            }
        },
        controllerAs: "transactionCtrl"
    };
})


app.directive("planPopulator", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/plan-populator.html',
        controller: function($scope, $http, DataShareService, TransactionSaveService){
            $scope.DaysToProject = 28;
            $scope.LoadTransactions = function(){
                $http.get("/bankplan/"+$scope.selectedBank+"?Days="+$scope.DaysToProject).success(function(data){
                    $scope.FutureTransactions = data.transactions;
                })
            };

            $scope.SaveTransaction = function(transaction){
                TransactionSaveService.SaveTransaction(DataShareService.selectedBank, transaction)
            }
            $scope.$on("selectedBankUpdated", function(){
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.LoadTransactions();
            })
            $scope.$on("TransactionUpdated",  $scope.LoadTransactions);
        }
    };
})

app.directive("fullSummary", function(){
    return {
        restrict:'E',
        templateUrl:'directives/full-summary.html',
        controller: function($scope, $http, DataShareService, FilterService) {
            $scope.selectedBank = "";
            $scope.activeTab = "byCategory";
            $scope.categoryFilter = "";
            $scope.FilterRange= "budget"
            $scope.GetSummaries = function () {

                var startDate = "";
                var endDate = "";
                if($scope.FilterRange=="budget"){
                    startDate = $scope.startDate
                    endDate = $scope.endDate;
                }

                $http.get("/banks/" + $scope.selectedBank + "/summary?startDate="+startDate+"&endDate="+endDate).success(function (data) {
                    $scope.summaryData = data;
                });
            }

            $scope.selectCategory = function(cat){
                $scope.categoryFilter = cat;
                FilterService.updateFilterSetting("categoryFilter", cat);
                return false;
            };

            $scope.ResetFilter = function(){
                $scope.categoryFilter = "";
                FilterService.updateFilterSetting("categoryFilter", "");
                return false;
            }

            $scope.ShowFullSummary = function(){
                $("#fullSummaryDialog").modal();
            }

            $scope.$watch("FilterRange", function(old, newValue){
                $scope.GetSummaries();
            })
            $scope.$on("selectedBankUpdated", function () {
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.startDate =  DataShareService.selectedBudgetStartDate;
                $scope.endDate =  DataShareService.selectedBudgetEndDate;
                $scope.GetSummaries();
            })

            $scope.$on("TransactionUpdated", function () {
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.GetSummaries();
            })

            $scope.SetActiveTab = function(tabName, li){

               $scope.activeTab = tabName;
            }
        }
    }
});
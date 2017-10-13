/**
 * Created by greenj on 6/27/15.
 */

app.directive('transactionBalance', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-balance.html'
    };
});

app.directive('statusFilters', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/Status-Filters.html'
    };
})

app.directive('accountSummary', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/account-summary.html'
    };
})

app.directive('transactionEditor', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-editor.html',
        // template: "<div>{{transactionObject.payee}}</div>",

        controller: function ($scope, $http, DataShareService, TransactionSaveService) {
            $scope.transactionObject = {};
            $scope.$on('selectedTransactionUpdated', function () {
                DataShareService.selectedTransaction.Date = new Date( DataShareService.selectedTransaction.Date);
                $scope.transactionObject = DataShareService.selectedTransaction;

                $scope.ShowOtherText = false;
            });
            $scope.ShowOtherText = false;

            this.ShowOtherTextBox = function () {
                $scope.transactionObject.category = '';
                $scope.ShowOtherText = true;
            }

            $scope.$on('categoryDataUpdated', function () {
                $scope.Categories = DataShareService.categoryData;
            });

            this.SaveTransaction = function () {
                TransactionSaveService.SaveTransaction(DataShareService.selectedBankId, $scope.transactionObject)
            }
        },
        controllerAs: 'transactionCtrl'
    };
})

app.directive('userPreference', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/user-preference.html',
        // template: "<div>{{transactionObject.payee}}</div>",

        controller:function ($http, $scope) {
    var self = this;
    this.Pin = '';
    this.password = '';
     $http.get('/User') .success(function(data){
                $scope.User=data;
    $http.get('/Bank')
        .success(function (data) {
            $scope.Banks = data;
            
             })
    });
   

   // this.defaultBank = $cookies.defaultBank;

    this.Save = function () {
       // var data = JSON.stringify({'username': this.username, 'defaultBank': this.defaultBank, 'Pin': this.Pin, 'password': this.password});

        $http.post('/User/'+$scope.User.id, $scope.User, {headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }}).success(function (arg1, arg2) {
                 $scope.User.password = "";
                 $scope.User.Pin = "";
                 $('#userPreference').modal('hide');
            }).error(function (arg1, arg2) {
                    alert('failed') });
    };
}
,
        controllerAs: 'userController'
    }
})

app.directive('planPopulator', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/plan-populator.html',
        controller: function ($scope, $http, DataShareService, TransactionSaveService) {
            $scope.DaysToProject = 28;

            
            $scope.$on('planIdSet', function(planId,ar2) {
                $scope.PlanId = ar2;
                $scope.LoadTransactions();
            });

            $scope.LoadTransactions = function () {
                $http.get('/Plan/'+$scope.PlanId + "/" + $scope.selectedBankId + '?days=' + $scope.DaysToProject).success(function (data) {
                    $scope.FutureTransactions = data.transactions;
                })
            };

            $scope.SaveTransaction = function (transaction) {
                TransactionSaveService.SaveTransaction(DataShareService.selectedBankId, transaction)
            }
            $scope.$on('selectedBankUpdated', function () {
                $scope.selectedBankId = DataShareService.selectedBankId;
                $scope.LoadTransactions();
            })
            $scope.$on('TransactionUpdated', $scope.LoadTransactions);
        }
    };
})

app.directive('fullSummary', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/full-summary.html',
        controller: function ($scope, $http, DataShareService, FilterService) {
            $scope.selectedBank = '';
            $scope.activeTab = 'byCategory';
            $scope.categoryFilter = '';
            $scope.FilterRange = 'thisMonth'
            $scope.GetSummaries = function () {
                var startDate = '';
                var endDate = '';
                if ($scope.FilterRange == 'thisMonth') {
                   var month = new Date().getMonth()+1;
                   var year = new Date().getFullYear();
                  
                   if(month == 13){
                       month = 1;
                       year += 1;
                   }
                    var endMonth = month + 1;
                    var endYear = year;
                   if(endMonth == 13){
                       endMonth = 1;
                       endYear += 1;
                   }
                
                  startDate = month+"/1/"+year;
                  endDate = endMonth + "/1/" + endYear;
                }
                 if ($scope.FilterRange == 'nextMonth') {
                  var month = new Date().getMonth()+1;
                   var year = new Date().getFullYear();
                   month = month + 1;
                   if(month == 13){
                       month = 1;
                       year += 1;
                   }
                    var endMonth = month + 1;
                    var endYear = year;
                   if(endMonth == 13){
                       endMonth = 1;
                       endYear += 1;
                   }
                
                  startDate = month+"/1/"+year;
                  endDate = endMonth + "/1/" + endYear;
                 }
                $http.get('/Summary/' + $scope.selectedBankId + '?startDate=' + startDate + '&endDate=' + endDate).success(function (data) {
                    $scope.summaryData = data;
                });
            }

            $scope.categoryFilters = function(cat){
                return cat.Active || cat.TotalTransactions > 0;
            }

            $scope.selectCategory = function (cat) {
                $scope.categoryFilter = cat;
                FilterService.updateFilterSetting('categoryFilter', cat);
                return false;
            };

            $scope.ResetFilter = function () {
                $scope.categoryFilter = '';
                FilterService.updateFilterSetting('categoryFilter', '');
                return false;
            }

            $scope.ShowFullSummary = function () {
                $('#fullSummaryDialog').modal();
            }

            $scope.$watch('FilterRange', function (old, newValue) {
                $scope.GetSummaries();
            })
            $scope.$on('selectedBankUpdated', function () {
               // alert()
                //console.log(DataShareService.selectedBank.bankId);
                
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.selectedBankId = DataShareService.selectedBankId;
                $scope.startDate = DataShareService.selectedBudgetStartDate;
                $scope.endDate = DataShareService.selectedBudgetEndDate;
                $scope.GetSummaries();
            })

            $scope.$on('TransactionUpdated', function () {
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.selectedBankId = DataShareService.selectedBankId;
                $scope.GetSummaries();
            })

            $scope.$on("categoryDataUpdated", function(){
                $scope.GetSummaries();
            })

            $scope.SetActiveTab = function (tabName, li) {
                $scope.activeTab = tabName;
            }
        }
    }
});

app.directive('budgetEditor', function(){
    return{
        
    }
});
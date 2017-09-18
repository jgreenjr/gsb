/**
 * Created by greenj on 6/27/15.
 */
app.directive('menuBar', ['$http', '$cookies', 'FilterService', function ($http, $cookies, FilterSerivce) {
    return {
        restrict: 'E',

        'templateUrl': 'directives/menu-bar.html',
        controller: function ($scope, DataShareService) {
            $scope.filters = FilterSerivce.filters;

            $scope.menuBarData = {email: 'asdf', banks: []};
            $http.get('/bank').success(function (data) {
                $scope.menuBarData.banks = data;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].bankName == $cookies.defaultBank) {
                        $scope.menuBarData.selectedBank = $cookies.defaultBank;
                        DataShareService.selectedBankUpdated(data[i]);
                        return;
                    }
                }
            });

            $http.get('/Session').success(function (data) {
                $scope.menuBarData.email = data.email;
                $scope.defaultBank = data.defaultBank;
                $scope.planId = data.PlanId;
                DataShareService.selectedBankUpdated( $scope.defaultBank);
                 $scope.menuBarData.selectedBank  = $scope.defaultBank.Name;
                DataShareService.PlanIdSet($scope.planId);
            });
            this.CreateBank = function () {
                $scope.targetBank = {
                    Name: 'New Bank',
                    Users: [$scope.menuBarData.email]
                };
                $('#bankEditor').modal();
            }

            $scope.OpenConfiguration = function(){
                $("#CategoryEditor").modal();
            }

            this.updateDisplay = function (type) {
                switch (type) {
                case 'showPending':
                    $scope.filters.showPending = !$scope.filters.showPending;
                    FilterSerivce.updateShowPending($scope.filters.showPending);
                    return false;
                case 'showCleared':
                    $scope.filters.showCleared = !$scope.filters.showCleared;
                    FilterSerivce.updateShowCleared($scope.filters.showCleared);
                    return false;
                case 'showFutureItems':
                    $scope.filters.showFutureTransaction = !$scope.filters.showFutureTransaction;
                    if ($scope.filters.showFutureTransaction)
                        {
                        $scope.filters.showNextSevenDays = false;
                    }

                    FilterSerivce.updateAllFilterSettings($scope.filters);
                    break;

                case 'showNextSevenDays':
                    $scope.filters.showNextSevenDays = !$scope.filters.showNextSevenDays;
                    if ($scope.filters.showNextSevenDays)
                        {
                        $scope.filters.showFutureTransaction = false;
                    }

                    FilterSerivce.updateAllFilterSettings($scope.filters);
                    break;
                case 'showNeedsTip':
                    $scope.filters.showNeedsTips = !$scope.filters.showNeedsTips;
                    FilterSerivce.updateAllFilterSettings($scope.filters);
                    break;
                case 'showThisMonth':
                    $scope.filters.showThisMonth = !$scope.filters.showThisMonth;
                    FilterSerivce.updateAllFilterSettings($scope.filters);
                    break;
                case 'showCurrentBalance':
                    $scope.filters.showCurrentBalance = !$scope.filters.showCurrentBalance;
                    FilterSerivce.updateAllFilterSettings($scope.filters);
                    break;
                }
                return false;
            }

            this.UpdateBankName = function (bankName) {
                $scope.menuBarData.selectedBank = bankName.Name;
                DataShareService.selectedBankUpdated(bankName);
            }

            $scope.OpenPopulatorWindow = function () {
                $('#planPopulatorModal').modal();
            }
            this.OpenPreference = function(){
                $('#userPreference').modal();
                return false;
            }

            this.AddTransaction = function () {
                var currentDate = new Date();

                var dateStr = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
                DataShareService.selectedTransactionUpdated({Date: dateStr, Status: 'Pending', Type: 'withdrawal' })
                $('#transactionModal').modal();
                return false;
            }

            $scope.UpdateSearchQuery = function () {
                FilterSerivce.updateFilterSetting('searchQuery', $scope.searchQuery);
                return false;
            }
        },
        controllerAs: 'menuCtrl',
        link: function (scope, element, attrs) {
            if (attrs.activeMenuItem) {
                scope.activeMenuItem = attrs.activeMenuItem;
            }
        }
    };
}]);

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
})
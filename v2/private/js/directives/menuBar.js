app.directive('menuBar', ['$http', '$cookies', 'FilterService', function ($http, $cookies, FilterSerivce) {
    return {
        restrict: 'E',

        'templateUrl': 'directives/menu-bar.html',
        controller: function ($scope, DataShareService) {
            $scope.filters = FilterSerivce.filters;
            $scope.alerts =[];
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
            $scope.AlertHtml = "";

            GetAlerts = function () {
                var returnValue = $("<div/>")
                var div = $("<div/>")
                div.addClass("alert-container");
                
                if($scope.alerts.length == 0)
                { 
                    div.append("<i>No Notifications</i>")
                }
                else{
                    var i = 0; 
                 
                    for(i = $scope.alerts.length-1; i >= 0; i--){
                        if($scope.alerts[i].Type == "transaction"){
                            var innerDiv = $("<div></div>");
                            innerDiv.append("<div>"+ $scope.alerts[i].Message+"</div>");
                            innerDiv.append("<div><b>Payee:</b> " + $scope.alerts[i].Payee+ "</div>");
                            innerDiv.append("<div><b>Amount:</b> $" + $scope.alerts[i].Amount +"</div>");
                            innerDiv.append("<div><b>Date:</b> $" + $scope.alerts[i].Date +"</div>");
                            div.append(innerDiv);
                        }
                    }
                }
                
              
                returnValue.append(div);
                return returnValue.html();
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

            $scope.$on("AddedTransaction", function (event, data) {
              
                var message = "Transaction"

                if(data.id){
                    message += " Updated"
                }
                else
                {
                    message+= " Added"
                }

                if(data.PlannedTransactionId){
                    message += " from Plan"
                }
                console.log(data);
                $scope.alerts.push({
                    Type: "transaction",
                    Message: message, 
                    Payee: data.Payee,
                    Amount: data.Amount,
                    Date: data.Date,
                    ActionDate: new Date()
                });
                
               
               
            })
        },
        controllerAs: 'menuCtrl',
        link: function (scope, element, attrs) {
            if (attrs.activeMenuItem) {
                scope.activeMenuItem = attrs.activeMenuItem;
            }
        }
    };
}]);
var model = null;
var ViewModel = function() {

    this.username = ko.observable("jay");

    this.PlanDayOptions = ko.observableArray(["7", "14", "21"]);

    this.StatusOptions = ko.observableArray(["Pending", "Cleared", "Closed"]);
    this.StatusOptions2 = ko.observableArray(["Pending", "Cleared", "Closed"]);
    this.title = ko.observable();
    this.total = ko.observable();
    this.ClearedBalance = ko.observable();
    this.loaded = ko.observable(false);
    //this.Transactions = ko.observableArray(buildTransactionModels(json.Transactions));
    this.Transactions = ko.observableArray();
    this.errors = ko.observableArray([]);
    this.warnings = ko.observableArray([]);
    this.messages = ko.observableArray([]);
    this.statusFilter = ko.observable("");
    this.categoryFilter = ko.observable("");
    this.transactionDate = ko.observable(new Date().toLocaleDateString())
    this.transactionPayee = ko.observable();
    this.transactionDeposit = ko.observable();
    this.transactionWidthdrawl = ko.observable();
    this.transactionCommandText = ko.observable("Add");
    this.transactionId = ko.observable();
    this.showFutureItems = ko.observable(true)
    this.numberOfFutureItems = ko.observable()
    this.cats = ko.observableArray([])
    this.filteredTransactions = ko.observableArray()
    this.bankplan = ko.observable();
    var currentDate = new Date();
    var summaryDate = (currentDate.getMonth() + 1) + "/1/" + currentDate.getFullYear()
    this.summaryDate = ko.observable(summaryDate);
    this.summary = ko.observable();

    this.WebBalance = ko.observable("");

    this.Difference = ko.computed(function() {
        if (this.WebBalance() != "" && this.total() != null) {
            return this.WebBalance() - this.total().ClearedBalance;
        }
    }, this)


    this.PlanDays = ko.observable(7);

    this.UpdateTransaction = function(item) {
        model.warnings(["Updating Transaction:" + item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated", item.payee)

    }

    this.bankName = ko.computed({
        read: function() {
            return bannerModel.bankName();
        },
        write: function(value) {
            bannerModel.bankName(value);
        },
        owner: this
    });

    this.bankNames = ko.computed({
        read: function() {
            return bannerModel.bankNames();
        },
        write: function(value) {
            bannerModel.bankNames(value);
        },
        owner: this
    });


    this.UpdateTransactionInModal = function(item) {
        $("#" + item.id + " #transactionModal").modal('toggle');
        $(".modal-backdrop").remove();
        model.warnings(["Updating Transaction:" + item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated", item.payee)

    }


    this.GetSummary = function() {
        $.ajax({
            url: "/summary?startDate=" + this.summaryDate(),
            dataType: "json",
            beforeSend: beforeSend,
            success: function(data) {
                model.summary(data);

            }
        });
    }

    this.GetBankPlan = function() {
        if (bannerModel.bankName()) {
            $.ajax({
                url: "/bankplan/" + selectedBankName + "?Days=" + model.PlanDays(),
                dataType: "json",
                beforeSend: beforeSend,
                success: function(data) {
                    model.bankplan(data);

                }
            });
            return false;
        }
    }


    this.DeleteTransaction = function(item) {

        if (confirm("Are you sure you want to delete:" + item.payee + "?")) {
            model.warnings(["Deleting Transaction:" + item.payee])
                //  model.ProcessTransaction(JSON.stringify(item), "DELETE", "Deleted", item.payee)
            $.ajax({
                url: "/banks/" + selectedBankName + "/" + item.id,
                type: "DELETE",
                success: function(data) {
                    model.warnings([])
                    model.messages(["Transaction Deleted: " + item.payee])
                    populateBank();
                },
                error: function(data) {
                    model.messages(["Transaction Failed to delete: " + item.payee])
                    populateBank();
                }
            });
        }
    }
    this.ShowDetails = function(item, arg2) {
        $("#" + item.id + " #transactionModal").modal();
        //  $("tr.subRow").hide();
        //    $(arg2.currentTarget).parent().parent().next().show();
    }

    this.ShowDifference = function() {
        $("#OnlineDifferenceCalculator").modal();
    }

    this.ProcessTransaction = function(item, action, actionText, transPayee) {
        this.warnings([])
        this.errors([]);
        var self = this;
        $.ajax({
            url: "/banks/" + selectedBankName,
            type: action,
            //  dataType: "json",
            contentType: "json",
            data: item,
            beforeSend: beforeSend,
            success: function(data2) {

                model.messages(["Transaction " + actionText + ": " + transPayee])
                populateBank();
                model.warnings([])

            },
            error: function(data2) {
                //console(data2);
                model.warnings([])
                model.messages([])
                model.errors(data2.responseJSON);
            }
        })
    }
    this.ShowSummary = function() {
        $("#SummaryModal").modal();
    }
    this.ShowFutureTransactions = function() {
        $('#myModal').modal()
    }


    this.ShowFilter = function() {
        $('#filterModel').modal()
    }

    this.transactionType = ko.computed(function() {

        if (this.transactionDeposit()) {
            return "deposit";
        } else if (this.transactionWidthdrawl()) {
            return "widthdrawl";
        }
        return "";
    }, this);

    this.transactionAmount = ko.computed(function() {
        if (this.transactionDeposit()) {
            return this.transactionDeposit();
        } else if (this.transactionWidthdrawl()) {
            return this.transactionWidthdrawl();
        }
        return "0";
    }, this);

    this.transactionTotal = ko.computed(function() {
        if (this.total())
            var t = parseFloat(this.total().ClearedBalance);
        if (this.transactionDeposit()) {
            return this.Money(parseFloat(this.transactionDeposit()) + t);
        } else if (this.transactionWidthdrawl()) {
            return this.Money(t - parseFloat(this.transactionWidthdrawl()));
        }
        return "-";
    }, this);
    this.Money = function(data) {

        return parseFloat(data).toFixed(2);

    };

    this.AddFutureTransaction = function(item) {
        model.warnings(["Adding Transaction: " + item.payee])
        model.ProcessTransaction(JSON.stringify(item), "POST", "Added", item.payee);
    }

    this.GetTransactionSettings = function(statusString) {
        var idString = "";

        if (this.transactionId() !== undefined) {
            idString = '"id": "' + this.transactionId() + '", ';
        }
        return '{"payee":"' + this.transactionPayee() + '", ' + idString + '"date":"' + this.transactionDate() + '", "amount":' + this.transactionAmount() + ', "type":"' + this.transactionType() + '", "Status":"' + statusString + '"}';
    };

    this.AddTransaction = function(args1, args2) {
        var statusString = "Pending";
        if (args2.target.id == "addAsCleared") {
            statusString = "Cleared";
        }

        var data = model.GetTransactionSettings(statusString);

        if (model.transactionId() === "" || model.transactionId() === undefined) {
            model.warnings(["Adding Transaction: " + model.transactionPayee()])
            model.ProcessTransaction(data, "POST", "Added", model.transactionPayee())
        } else {
            model.warnings(["Updating Transaction: " + model.transactionPayee()])
            model.ProcessTransaction(data, "PUT", "Updated", model.transactionPayee())
        }

    }


    this.filterSettings = function() {
        var statusFilter = model.statusFilter();
        if (statusFilter == undefined) {
            statusFilter = "";
        }

        var categoryFilter = model.categoryFilter();
        if (categoryFilter == undefined) {
            categoryFilter = "";
        }
        var showFutureItems = model.showFutureItems();
        if (showFutureItems == undefined) {
            showFutureItems = false;
        }
        return "?PageNumber=1&StatusFilter=" + statusFilter + "&CategoryFilter=" + categoryFilter + "&ShowFutureItems=" + model.showFutureItems();
    }
};

function populateBank() {

    if (model == null || selectedBankName == "") {
        return;
    }
    $.ajax({
        url: "/categories/" + selectedBankName,
        dataType: "json",
        success: function(data) {
            model.cats(data);
            $.ajax({
                url: "/banks/" + selectedBankName + model.filterSettings(),
                dataType: "json",
                beforeSend: beforeSend,
                success: function(data) {

                    model.transactionPayee("");
                    model.transactionDeposit("");
                    model.transactionWidthdrawl("");

                    model.total(data.Total);
                    model.ClearedBalance(data.Total.ClearedBalance);
                    model.Transactions(data.Transactions);
                    model.numberOfFutureItems(data.FutureItemCount);
                    model.GetSummary();
                    model.GetBankPlan()
                        //model.FilterTransactions( model.showFutureItems(), model.statusFilter(),model.categoryFilter())
                    model.loaded(true);


                },
                error: function(data2) {

                }
            });
        },
        error: function(data2) {

            model.errors(data2.responseJSON);
        }
    })
}
model = new ViewModel();
ko.applyBindings(model, $("#bankSheet")[0]);

$(function() {
    $(".transactionDate").datepicker();
})

function beforeSend(xhr) {


    xhr.setRequestHeader('bank', selectedBankName);
}

function LoadTransaction(id) {
    $.ajax({
        url: "/transaction" + id,
        dataType: "json",
        beforeSend: beforeSend,
        success: function(data) {
            model.transactionDate(data.date);
            model.transactionId(data.id);
            if (data.type == "deposit") {
                model.transactionWidthdrawl("");
                model.transactionDeposit(data.amount);
                model.transactionCommandText("Update");
            } else {

                model.transactionWidthdrawl(data.amount);
            }
        }
    });
}


function formatMoney(data) {

    return "$" + parseFloat(data).toFixed(2);

};

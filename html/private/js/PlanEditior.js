var PlanEditorModel = function() {
    this.Transactions = ko.observableArray([]);
    this.Iterations = ko.observableArray(["day", "month"]);
    this.Types = ko.observableArray(["deposit", "widthdrawl"]);
    this.cats = ko.observableArray([]);
    this.messages = ko.observableArray([]);

    this.projectionDate = ko.observable();
    this.projectionDays = ko.observable();
    this.projectedDelta = ko.observable();
    this.projectedDeltaTransactions = ko.observableArray([]);
    this.Money = function(data) {

      return parseFloat(data).toFixed(2);

    };


    this.refreshDelta = function() {
        var startDate = model.projectionDate();
        var days = model.projectionDays();

        $.ajax({
            url: "/bankplan/" + selectedBankName + "?Days=" + days + "&startDate=" + startDate,
            dataType: "json",
            beforeSend: beforeSend,
            success: function(data) {
                model.projectedDelta(data.Total.ActualBalance);
                model.projectedDeltaTransactions(data.transactions);
            }
        });
    }

    this.ShowProjections = function(){
      $("#myModal").modal();
    }

    this.AddRow = function() {
        this.Transactions.push({
            "active": false,
            "startDate": "",
            "repeatInterval": 0,
            "repeatUnit": "",
            "payee": "",
            "amount": 0,
            "type": "",
            "category": ""
        });
    }
    this.UpdateTransaction = function(item) {
        $.ajax({
            url: "/plans/" + selectedBankName,
            type: "POST",
            //dataType: "json",
            contentType: "json",
            data: JSON.stringify(item),
            beforeSend: beforeSend,
            success: function(data) {
                model.messages.pop();
                model.messages.push({
                    "Message": "Plan Updated",
                    "class": "alert alert-success"
                })
                populateBank();
            },
            error: function(data) {
                model.messages.pop();
                model.messages.push({
                    "Message": "Failed to Updated: Check Data",
                    "class": "alert alert-danger"
                })
            }
        });
    }

    this.Update = function() {
        model.messages([]);
        $.ajax({
            url: "/plan",
            type: "POST",
            dataType: "json",
            contentType: "json",
            data: JSON.stringify(model.Transactions()),
            beforeSend: beforeSend,
            success: function(data) {
                model.messages.push({
                    "Message": "Plan Updated",
                    "class": "alert alert-success"
                })
            },
            error: function(data) {
                model.messages.push({
                    "Message": "Failed to Updated: Check Data",
                    "class": "alert alert-danger"
                })
            }
        });
    }
}

var model = new PlanEditorModel();;
ko.applyBindings(model, $(".container")[0]);

function populateBank() {
    if (selectedBankName != "") {
        $.ajax({
            url: "/categories/" + selectedBankName,
            dataType: "json",
            success: function(data) {

                model.cats(data);
                $.ajax({
                    url: "/plans/" + selectedBankName,
                    success: function(data) {
                        model.Transactions(data.Transactions);


                    },
                    error: function(data2) {

                    }
                });
            }
        });
    }
}


function beforeSend(xhr) {


    xhr.setRequestHeader('bank', selectedBankName);
}

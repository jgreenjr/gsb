var PlanEditorModel = function () {
    this.Transactions = ko.observableArray([]);
    this.Iterations = ko.observableArray(['day', 'month']);
    this.Types = ko.observableArray(['deposit', 'withdrawal']);
    this.cats = ko.observableArray([]);
    this.messages = ko.observableArray([]);

    this.projectionDate = ko.observable();
    this.projectionDays = ko.observable();
    this.projectedDelta = ko.observable();
    this.projectedDeltaTransactions = ko.observableArray([]);
    this.Money = function (data) {
        return parseFloat(data).toFixed(2);
    };

    this.refreshDelta = function () {
        var startDate = model.projectionDate();
        var days = model.projectionDays();

        $.ajax({
            url: '/bankplan/' + selectedBankId + '?Days=' + days + '&startDate=' + startDate,
            dataType: 'json',
            beforeSend: beforeSend,
            success: function (data) {
                model.projectedDelta(data.Total.ActualBalance);
                model.projectedDeltaTransactions(data.transactions);
            }
        });
    }

    this.ShowProjections = function () {
        $('#myModal').modal();
    }

    this.AddRow = function () {
        this.Transactions.push({
            'active': false,
            'startDate': '',
            'repeatInterval': 0,
            'repeatUnit': '',
            'payee': '',
            'amount': 0,
            'type': '',
            'category': ''
        });
    }
    this.UpdateTransaction = function (item) {
 alert(newPlan);
        url = '/Plan/' + selectedBankId;
        action = "POST";
        if(newPlan)
            {
                url = "/Plan";
                action= "PUT";
            }

        $.ajax({
            url: url,
            type: action,
            // dataType: "json",
            contentType: 'json',
            data: JSON.stringify(item),
            beforeSend: beforeSend,
            success: function (data) {
                model.messages.pop();
                model.messages.push({
                    'Message': 'Plan Updated',
                    'class': 'alert alert-success'
                })
                populateBank();
            },
            error: function (data) {
                model.messages.pop();
                model.messages.push({
                    'Message': 'Failed to Updated: Check Data',
                    'class': 'alert alert-danger'
                })
            }
        });
    }

    this.Update = function () {
        alert(newPlan);
        url = '/Plan/' + selectedBankId;
        action = "POST";
        if(newPlan)
            {
                url = "/Plan";
                action: "PUT";
            }

        model.messages([]);
        $.ajax({
            url: url,
            type: action,
            dataType: 'json',
            contentType: 'json',
            data: JSON.stringify(model.Transactions()),
            beforeSend: beforeSend,
            success: function (data) {
                model.messages.push({
                    'Message': 'Plan Updated',
                    'class': 'alert alert-success'
                })
            },
            error: function (data) {
                model.messages.push({
                    'Message': 'Failed to Updated: Check Data',
                    'class': 'alert alert-danger'
                })
            }
        });
    }
}

var model = new PlanEditorModel(); ;
ko.applyBindings(model, $('.container')[0]);

function populateBank () {
    if (selectedBankName != '') {
        $.ajax({
            url: '/Category/' + selectedBankId,
            dataType: 'json',
            success: function (data) {
                model.cats(data);
                $.ajax({
                    url: '/Plan/' + selectedBankId,
                    success: function (data) {
                        model.Transactions(data.Transactions);
                        newPlan = false;
                    },
                    error: function (data2) {
                        newPlan = true;        
                    }
                });
            }
        });
    }
}

function beforeSend (xhr) {
    xhr.setRequestHeader('bank', selectedBankName);
}

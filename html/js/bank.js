var model = null;
var ViewModel = function() {

    
    this.bankNames = ko.observableArray([]);
    this.bankName = ko.observable();
    
    this.DoThis = ko.computed(function(){
        if(this.bankName())
        {
           selectedBankName = this.bankName().bankName;
           if(needBankData)
           populateBank();
           
        }
    }
    , this)
    
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
    this.statusFilter = ko.observable();
    this.categoryFilter = ko.observable();
    this.transactionDate = ko.observable(new Date().toLocaleDateString())
    this.transactionPayee = ko.observable();
    this.transactionDeposit = ko.observable();
    this.transactionWidthdrawl = ko.observable();
    this.transactionCommandText = ko.observable("Add");
    this.transactionId = ko.observable();
    this.showFutureItems = ko.observable(true)
    this.numberOfFutureItems = ko.observable()
    this.cats =  ko.observableArray([])
    this.filteredTransactions = ko.observableArray()
    this.bankplan = ko.observable();
    var currentDate = new Date();
    var summaryDate = (currentDate.getMonth()+1)+ "/1/"+currentDate.getFullYear()
    this.summaryDate = ko.observable(summaryDate);
    this.summary = ko.observable();
    
    this.WebBalance = ko.observable("");
    
    this.Difference = ko.computed(function(){
        if(this.WebBalance() != "" && this.total() != null){
            return this.WebBalance() - this.total().ClearedBalance;
        }
    }, this)
    
    
    this.PlanDays = ko.observable(7);
  
    this.UpdateTransaction = function(item){
        model.warnings(["Updating Transaction:"+item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated",item.payee)
        
    }
    
    this.bankPlanClass = ko.observable("btn btn-info")/*ko.computed(function(){
       if(this.bankplan && this.bankplan.warnings.length > 0){
           return "btn btn-danger";
       } 
       
       return "btn btn-info";
    });
    */
    
    this.UpdateTransactionInModal = function(item){
        $("#"+item.id+ " #transactionModal").modal('toggle');
        $(".modal-backdrop").remove();
        model.warnings(["Updating Transaction:"+item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated",item.payee)
        
    }
    
      this.showFutureItems.subscribe(function(newValue){model.FilterTransactions(newValue, model.statusFilter(), model.categoryFilter())});
      this.statusFilter.subscribe(function(newValue){model.FilterTransactions(model.showFutureItems(), newValue, model.categoryFilter())});
      this.categoryFilter.subscribe(function(newValue){model.FilterTransactions(model.showFutureItems(), model.statusFilter(), newValue)});
      this.PlanDays.subscribe(function(newValue){model.GetBankPlan()});
        this.summaryDate.subscribe(function(newValue){
            model.GetSummary();
        });
        
        this.bankplan.subscribe(function(newValue){
           
              if(newValue && newValue.warnings.length > 0){
           model.bankPlanClass("btn btn-danger");
          return;
       } 
       
       
       model.bankPlanClass("btn btn-info");
        })
    
    this.GetSummary = function (){
        $.ajax({
            url: "/summary?startDate=" + this.summaryDate(),
            dataType: "json",
            beforeSend: beforeSend,
            success: function(data){
                model.summary(data);
               
            }
        });
    } 
    
    this.GetBankPlan = function (){
        if(model.bankName())
        {
        $.ajax({
            url: "/bankplan?Days="+model.PlanDays(),
            dataType: "json",
            beforeSend: beforeSend,
            success: function(data){
                model.bankplan(data);
               
            }
        });
        }
    } 
    this.FilterTransactions = function(newValue, statusFilter, categoryFilter ){
       
        if(!statusFilter)
            statusFilter = "";
        if(!categoryFilter)
            categoryFilter = "";
        var trans = model.Transactions()
        var returnValue = [];
        for(var i = 0; i < trans.length; i++){
            var isFutureItem =trans[i].IsFutureItem;
            if((!isFutureItem||newValue) 
                && (statusFilter == "" || trans[i].Status == statusFilter)
                && (categoryFilter == "" || trans[i].category == categoryFilter))
            {
               returnValue.push(trans[i]);
            }
        
        }
        
        model.filteredTransactions(returnValue);
    }
    
     this.DeleteTransaction = function(item){
         
         if(confirm("Are you sure you want to delete:" + item.payee+"?"))
       { model.warnings(["Deleting Transaction:"+item.payee])
        model.ProcessTransaction(JSON.stringify(item), "DELETE", "Deleted", item.payee)
       }
    }
     this.ShowDetails = function(item, arg2){
      $("#"+item.id+ " #transactionModal").modal();
       //  $("tr.subRow").hide();
    //    $(arg2.currentTarget).parent().parent().next().show();
    }
    
    this.ShowDifference = function(){
        $("#OnlineDifferenceCalculator").modal();
    }
   
    this.ProcessTransaction = function(item, action, actionText, transPayee){
        this.warnings([])
      this.errors([]);
       var self = this;
    $.ajax({  
      url: "/transaction",  
      type: action ,  
      dataType: "json",  
      contentType: "json",  
      data: item,  
      beforeSend: beforeSend,
      success: function(data2){     
           model.messages(["Transaction " + actionText + ": "+transPayee])
       model.total(data2.Total);
       model.Transactions(data2.Transactions);
       model.FilterTransactions( model.showFutureItems(), model.statusFilter(), model.categoryFilter())
    model.GetSummary()
    model.GetBankPlan()
       model.transactionDate(new Date().toLocaleDateString());
       model.transactionWidthdrawl("");
       model.transactionDeposit("");
       model.transactionPayee("");
        model.warnings([])
       
      },  
      error: function(data2){  
          model.warnings([])
            model.messages([])
        model.errors(data2.responseJSON);  
      }  
    })
    }
    this.ShowSummary = function(){
        $("#SummaryModal").modal();
    }
    this.ShowFutureTransactions = function(){
       $('#myModal').modal()
    }
    
    
    this.ShowFilter = function(){
       $('#filterModel').modal()
    }
    
     this.transactionType = ko.computed(function(){
         
       if(this.transactionDeposit()){
           return "deposit";
       }
       else if(this.transactionWidthdrawl()){
           return "widthdrawl";
       }
       return "";
    },this);
    
     this.transactionAmount = ko.computed(function(){
       if(this.transactionDeposit()){
           return this.transactionDeposit();
       }
       else if(this.transactionWidthdrawl()){
           return this.transactionWidthdrawl();
       }
       return "0";
    },this);
    
      this.transactionTotal = ko.computed(function(){
          if(this.total())
         var  t = parseFloat(this.total().ClearedBalance) ;
       if(this.transactionDeposit()){
           return this.Money(parseFloat(this.transactionDeposit()) + t);
       }
       else if(this.transactionWidthdrawl()){
           return this.Money(t- parseFloat(this.transactionWidthdrawl()));
       }
       return "-";
    },this);
    this.Money = function(data){
          
        return parseFloat(data).toFixed(2);
        
    };
   
    this.AddFutureTransaction = function(item){
      model.warnings(["Adding Transaction: "+ item.payee])
       model.ProcessTransaction(JSON.stringify(item), "POST", "Added",item.payee);
    }
    
    this.GetTransactionSettings = function(){
    var idString = "";
    
    if(this.transactionId() !== undefined){
        idString = '"id": "' + this.transactionId() + '", ';
    }
     return  '{"payee":"'+ this.transactionPayee() +'", '+ idString + '"date":"'+ this.transactionDate() +'", "amount":'+ this.transactionAmount() +', "type":"'+ this.transactionType() +'"}';
    };
    
  this.AddTransaction = function (){
      
       var data = model.GetTransactionSettings();
       
       if(model.transactionId() === "" || model.transactionId() === undefined){
       model.warnings(["Adding Transaction: "+ model.transactionPayee()])
       model.ProcessTransaction(data, "POST", "Added",model.transactionPayee())
       }
       else
       {
        model.warnings(["Updating Transaction: "+ model.transactionPayee()])
        model.ProcessTransaction(data, "PUT", "Updated",model.transactionPayee())
       }
    
}
};
  function populateBank(){
 $.ajax({
    url: "/bank",
    dataType: "json",
    beforeSend: beforeSend,
    success: function(data){
   
     model.total(data.Total);
     model.ClearedBalance(data.Total.ClearedBalance);
    model.Transactions(data.Transactions);
    model.numberOfFutureItems(data.FutureItemCount);
    model.GetSummary();
    model.GetBankPlan()
    model.FilterTransactions( model.showFutureItems(), model.statusFilter(),model.categoryFilter())
    $( ".transactionDate" ).datepicker();
    $( ".transactionDate" ).datepicker("option", "dateFormat", "m/d/yyyy" );
    model.loaded(true);
    
    },
     error: function(data2){  
     
        model.errors(data2.responseJSON);  
      }  
 })
  }
model = new ViewModel();

 $.ajax({
    url: "/banks",
    dataType: "json",
    success: function(data){
    
    ko.applyBindings(model); // This makes Knockout get to work
    model.bankNames(data);
    if(window.location.search != "")
    {
        var search = window.location.search;
        var transID = search.substr(0,window.location.search.indexOf("&bank"));
        model.bankName(search.substr(window.location.search.indexOf("bank")+5));
        LoadTransaction(transID);
    }
    },
     error: function(data2){  
       
      }  
 });
 
  $.ajax({
    url: "/categories",
    dataType: "json",
    success: function(data){
  
    model.cats(data);
   
    },
     error: function(data2){  
       
      }  
 });
 $(function(){ $( ".transactionDate" ).datepicker();})
 
 function beforeSend(xhr) {
        xhr.setRequestHeader('bank', selectedBankName);
    }

function LoadTransaction(id){
    $.ajax({
    url: "/transaction"+id,
    dataType: "json",
    beforeSend:beforeSend,
    success: function(data){
     model.transactionDate(data.date);
     model.transactionId(data.id);
     if(data.type == "deposit")
       {model.transactionWidthdrawl("");
       model.transactionDeposit(data.amount);
       model.transactionCommandText("Update");
       }
       else
       {
        
       model.transactionWidthdrawl(data.amount);
       }
    }
    });
}

   
   function formatMoney(data){
          
        return "$"+parseFloat(data).toFixed(2);
        
    };   
    
   
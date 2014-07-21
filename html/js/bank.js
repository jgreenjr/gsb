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
    
    this.StatusOptions = ko.observableArray(["Pending", "Cleared", "Closed"]);
    
    this.title = ko.observable();
    this.total = ko.observable();
    this.ClearedBalance = ko.observable();
    this.loaded = ko.observable(false);
    //this.Transactions = ko.observableArray(buildTransactionModels(json.Transactions));
    this.Transactions = ko.observableArray();
    this.errors = ko.observableArray([]);
    this.warnings = ko.observableArray([]);
    this.messages = ko.observableArray([]);
    this.transactionDate = ko.observable(new Date().toLocaleDateString())
    this.transactionPayee = ko.observable();
    this.transactionDeposit = ko.observable();
    this.transactionWidthdrawl = ko.observable();
    this.transactionCommandText = ko.observable("Add");
    this.transactionId = ko.observable();
    this.showFutureItems = ko.observable(false)
    this.cats =  ko.observableArray([])
    this.filteredTransactions = ko.observableArray()
    
  
    this.UpdateTransaction = function(item){
        model.warnings(["Updating Transaction:"+item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated",item.payee)
        
    }
    
      this.showFutureItems.subscribe(function(newValue){model.FilterTransactions(newValue)});
    
    
    this.FilterTransactions = function(newValue){
        alert(newValue);
        var trans = model.Transactions()
        var returnValue = [];
        var today = new Date();
        for(var i = 0; i < trans.length; i++){
            
            if(new Date(trans[i].date) <= today||newValue)
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
         $("tr.subRow").hide();
        $(arg2.currentTarget).parent().parent().next().show();
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
       model.total(data2.Total.ActualBalance);
       model.ClearedBalance(data2.Total.ClearedBalance)
       model.Transactions(data2.Transactions);
       model.FilterTransactions( model.showFutureItems())
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
    
     this.transactionType = ko.computed(function(){
         var  t = parseFloat(this.total()) ;
       if(this.transactionDeposit()){
           return "deposit";
       }
       else if(this.transactionWidthdrawl()){
           return "widthdrawl";
       }
       return "";
    },this);
    
     this.transactionAmount = ko.computed(function(){
         var  t = parseFloat(this.total()) ;
       if(this.transactionDeposit()){
           return this.transactionDeposit();
       }
       else if(this.transactionWidthdrawl()){
           return this.transactionWidthdrawl();
       }
       return "0";
    },this);
    
      this.transactionTotal = ko.computed(function(){
         var  t = parseFloat(this.total()) ;
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
   
     model.total(data.Total.ActualBalance);
     model.ClearedBalance(data.Total.ClearedBalance);
    model.Transactions(data.Transactions);
    model.FilterTransactions( model.showFutureItems())
    $( ".transactionDate" ).datepicker();
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

      
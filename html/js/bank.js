var model = null;
var ViewModel = function(json) {
    this.title = ko.observable(json.title);
    this.total = ko.observable(json.Total);
    //this.Transactions = ko.observableArray(buildTransactionModels(json.Transactions));
    this.Transactions = ko.observableArray(json.Transactions);
    this.errors = ko.observableArray([]);
    this.transactionDate = ko.observable(new Date().toLocaleDateString())
    this.transactionPayee = ko.observable();
    this.transactionDeposit = ko.observable();
    this.transactionWidthdrawl = ko.observable();
    
    this.UpdateTransaction = function(item){
       var self = this;
    $.ajax({  
      url: "/transaction",  
      type: "PUT",  
      dataType: "json",  
      contentType: "json",  
      data: JSON.stringify(item),  
      beforeSend: beforeSend,
      success: function(data2){     
          
       model.total(data2.Total);
       model.Transactions(data2.Transactions);
       model.transactionDate(new Date().toLocaleDateString());
       model.transactionWidthdrawl("");
       model.transactionDeposit("");
       model.transactionPayee("");
      },  
      error: function(data2){  
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
       return "";
    },this);
    this.Money = function(data){
          
        return parseFloat(data).toFixed(2);
        
    };
   
    
    this.GetTransactionSettings = function(){
   
     return  '{"payee":"'+ this.transactionPayee() +'", "date":"'+ this.transactionDate() +'", "amount":'+ this.transactionAmount() +', "type":"'+ this.transactionType() +'"}';
    };
    
  this.AddTransaction = function (){
      this.errors([]);
   var data = this.GetTransactionSettings();
    var self = this;
    $.ajax({  
      url: "/transaction",  
      type: "POST",  
      dataType: "json",  
      contentType: "json",  
      data: data,  
      beforeSend: beforeSend,
      success: function(data2){     
          
       self.total(data2.Total);
       self.Transactions(data2.Transactions);
       self.transactionDate(new Date().toLocaleDateString());
       self.transactionWidthdrawl("");
       self.transactionDeposit("");
       self.transactionPayee("");
      },  
      error: function(data2){  
        self.errors(data2.responseJSON);  
      }  
    });
   
   function buildTransactionModels(arr){
       var returnValue = []
       for(i = 0; i < arr.length; i++){
           returnValue.push(new TransactionModel(arr[i]));
       }
       return returnValue;
   }
}
};
  function populateBank(){
 $.ajax({
    url: "/bank",
    dataType: "json",
    beforeSend: beforeSend,
    success: function(data){
    model = new ViewModel(data)
    ko.applyBindings(model, $("#bankSheet")[0]); // This makes Knockout get to work
    },
     error: function(data2){  
        model = new ViewModel({})
        ko.applyBindings(model); // This makes Knockout get to work
        model.errors(data2.responseJSON);  
      }  
 })
  }

 $.ajax({
    url: "/banks",
    dataType: "json",
    success: function(data){
    var bankmodel = new BankModel(data)
  
    ko.applyBindings(bankmodel, $("#bankSelect")[0]); // This makes Knockout get to work
    },
     error: function(data2){  
       
      }  
 });
 
 function beforeSend(xhr) {
        xhr.setRequestHeader('bank', selectedBankName);
    }

var BankModel = function(json){
    this.bankNames = ko.observableArray(json);
    this.bankName = ko.observable();
    
    this.DoThis = ko.computed(function(){
        if(this.bankName())
        {
           selectedBankName = this.bankName().bankName;
           populateBank();
           $("#bankSheet").show();
        }
    }
    , this)
    }
var selectedBankName = "";
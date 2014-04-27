var model = null;
var ViewModel = function(json) {
    this.title = ko.observable(json.title);
    this.total = ko.observable(json.Total);
    this.Transactions = ko.observableArray(json.Transactions);
    this.errors = ko.observableArray([]);
    this.transactionDate = ko.observable(new Date().toLocaleDateString())
    this.transactionPayee = ko.observable();
    this.transactionDeposit = ko.observable();
    this.transactionWidthdrawl = ko.observable();
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
    this.MoneyWithType = function (amount, type){
        if(type)
           return parseFloat(amount).toFixed(2); 
        return "";
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
   
}
};
 
 $.getJSON("/bank", function(data){
    model = new ViewModel(data)
    ko.applyBindings(model); // This makes Knockout get to work
 })


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
    
    this.title = ko.observable();
    this.total = ko.observable();
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
    
    this.UpdateTransaction = function(item){
        model.warnings(["Updating Transaction:"+item.payee]);
        model.ProcessTransaction(JSON.stringify(item), "PUT", "Updated",item.payee)
        
    }
    
     this.DeleteTransaction = function(item){
        model.warnings(["Deleting Transaction:"+item.payee])
        model.ProcessTransaction(JSON.stringify(item), "DELETE", "Deleted", item.payee)
    }
     this.ShowDetails = function(item, arg2){
        console.log(arg2);
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
       model.transactionDate(new Date().toLocaleDateString());
       model.transactionWidthdrawl("");
       model.transactionDeposit("");
       model.transactionPayee("");
        model.warnings([])
       
       var self = this;
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
   
     return  '{"payee":"'+ this.transactionPayee() +'", "date":"'+ this.transactionDate() +'", "amount":'+ this.transactionAmount() +', "type":"'+ this.transactionType() +'"}';
    };
    
  this.AddTransaction = function (){
      this.errors([]);
       var data = model.GetTransactionSettings();
       model.warnings(["Adding Transaction: "+ model.transactionPayee()])
       model.ProcessTransaction(data, "POST", "Added",model.transactionPayee())
       
/*      this.errors([]);
      
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
    */
    
}
};
  function populateBank(){
 $.ajax({
    url: "/bank",
    dataType: "json",
    beforeSend: beforeSend,
    success: function(data){
   
     model.total(data.Total);
    model.Transactions(data.Transactions);
     $( ".transactionDate" ).datepicker();
    model.loaded(true);
    },
     error: function(data2){  
     
        model.errors(data2.responseJSON);  
      }  
 })
  }

 $.ajax({
    url: "/banks",
    dataType: "json",
    success: function(data){
    model = new ViewModel()
    ko.applyBindings(model); // This makes Knockout get to work
    model.bankNames(data)
    },
     error: function(data2){  
       
      }  
 });
 $(function(){ $( ".transactionDate" ).datepicker();})
 
 function beforeSend(xhr) {
        xhr.setRequestHeader('bank', selectedBankName);
    }

var selectedBankName = "";
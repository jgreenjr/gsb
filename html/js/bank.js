var model = null;
var ViewModel = function(json) {
    this.title = ko.observable(json.title);
    this.total = ko.observable(json.Total);
    this.Transactions = ko.observableArray(json.Transactions);
    this.Money = function(data){
          
        return parseFloat(data).toFixed(2);
        
    };
};
 
 $.getJSON("/bank", function(data){
    model = new ViewModel(data)
    ko.applyBindings(model); // This makes Knockout get to work
 })

function AddTransaction(){
    var data =  '{"payee":"testPayee", "date":"1/1/2013", "amount":100.00, "type":"deposit"}';
    
    $.ajax({  
      url: "/transaction",  
      type: "POST",  
      dataType: "json",  
      contentType: "json",  
      data: data,  
      success: function(data2){     
          
       model.total(data2.Total);
       model.Transactions(data2.Transactions);
      },  
      error: function(){  
        alert("fail :-(");  
      }  
    });  
   
}
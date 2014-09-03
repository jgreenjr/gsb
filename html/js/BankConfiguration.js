var bankModel = function(){
    
    this.userlist = ko.observableArray([]);
    this.AddUserErrors = ko.observableArray([]);
   this.data = ko.observableArray([]);
    this.selectedBank = ko.observable();
    this.UserToAdd = ko.observable();
    this.GetFullData = function(){
       $.ajax({
    url: "/BankConfiguration",
    dataType: "json",
    success: function(data){
    ko.applyBindings(bankConfigurationModel, $("#bankConfigurationModel")[0]);
    bankConfigurationModel.data(data);
   
    }
  });
      
    }
        this.OpenAddUser = function(args1, args2){
            bankConfigurationModel.selectedBank(args1);
            $("#AddUserDialog").modal();
        };
        
        this.addUser= function(){
            this.AddUserErrors([])
            var sBank = bankConfigurationModel.selectedBank();
          for(var i = 0; i < sBank.users.length;i++){
              if(sBank.users[i] == bankConfigurationModel.UserToAdd()){
                  this.AddUserErrors([{"ErrorCode": "AlreadyExist", Message: "User already added to this bank"}])
                  return;
              }
          }
          
        }
        
       
    this.removeUser = function(){};
}
var bankConfigurationModel = new bankModel();
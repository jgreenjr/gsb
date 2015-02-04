var bankModel = function(){
var first = true;
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
      if(first)
        ko.applyBindings(bankConfigurationModel, $("#bankConfigurationModel")[0]);
        first = false;
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
            var sBank = bankConfigurationModel.selectedBank().title;
            var user = bankConfigurationModel.UserToAdd();

          $.ajax({
            url: "/Banks/"+sBank+"/users",
            type: "PUT",
            contentType: "json",
            data: JSON.stringify({username:user}),
            success: function(data){
              bankConfigurationModel.GetFullData();
              $("#AddUserDialog").modal('hide');
            },
            error: function(data){
              bankConfigurationModel.AddUserErrors([{"ErrorCode": "AlreadyExist", Message: "User already added to this bank"}])
            }
          })
        }
      this.CreateBank = function(title){
        $.ajax({
          url: "/Banks",
          type: "POST",
          contentType: "json",
          data: JSON.stringify({title:title}),
          success: function(data){
            alert("Bank Created");
            bankConfigurationModel.GetFullData();
          },
          error: function(data){
            alert("failed to create")
          }
        })
      }

      this.DeleteBank = function(title){
        $.ajax({
          url: "/Banks/"+title,
          type: "DELETE",
          success: function(data){
            alert("Bank deleted");
            bankConfigurationModel.GetFullData();
          },
          error: function(data){
            alert("failed to delete")
          }
        })
      }

    this.removeUser = function(args1, args2){
      var sBank = $(args2.currentTarget).parent().parent().parent().parent().children("td").eq(0).html();
      var user = args1;
      $.ajax({
        url: "/Banks/"+sBank+"/users/"+user,
        type: "delete",
        success: function(data){
          bankConfigurationModel.GetFullData();

        },
        error: function(data){
          alert("Could not delete user");
        }
    });
}
}
var bankConfigurationModel = new bankModel();

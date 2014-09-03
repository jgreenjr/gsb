String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var loginModel = function(){
  this.username = ko.observable();
  this.password = ko.observable();
  this.ErrorMessage = ko.observable("");
  
 
  this.SignIn = function(){
    var hashword = this.username()+ this.password();
      $.ajax({
            url: "/login?Username="+this.username()+"&Hassword="+hashword.hashCode(),
              success: function(data){
                
              document.cookie = "sessionKey="+ data.sessionKey;
              document.cookie = "defaultBank="+data.defaultBank;
                window.location=data.RedirectUrl;
              
            },
            error:  function(response){
              model.ErrorMessage(response.responseJSON.Message);
            }
        });
        return false;
  }
}
var model = new loginModel();
ko.applyBindings(model); // This makes Knockout get to work

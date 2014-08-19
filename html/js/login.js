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

var loginModal = function(){
  this.username = ko.observable();
  this.password = ko.observable();
  
  this.SignIn = function(){
      $.ajax({
            url: "/login?login="+this.username()+"&password="+this.password(),
              success: function(data){
                window.location="/bank.html";
               
            }
        });
  }
}

var BannerModal = function(){
    this.username = ko.observable("");
    this.bankNames = ko.observableArray([]);
    this.bankName = ko.observable("");
   
    
    this.loadFromCookie = function(){
      var cookies = document.cookie.split(";");
        var bname = "";
    for(var i = 0; i < cookies.length; i++){
        var parts = cookies[i].split('=')
        if(parts[0]== " defaultBank")
        {
            bname = parts[1];  
          
        }
        if(parts[0]== " currentBank")
        {
            bname = parts[1];  
            break;
        }
    }
    this.SetBankName({bankName: bname});
  
    }
     
    this.SetBankName = function(item){
      document.cookie = "currentBank=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie = "currentBank="+item.bankName;
        bannerModel.bankName(item)
    }
   
    
    this.DoThis = ko.computed(function(){
       
        if(this.bankName())
        {
           selectedBankName = this.bankName().bankName;
        if(needBankData)
           populateBank();
           
        }
    }
    , this)
    
      this.logout = function(){
         $.ajax({
            url: "/logout",
                     success: function(data){
                document.cookie = "sessionKey=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
                window.location="login.html"
               
            }
        });
    }
}

var  bannerModel = new BannerModal();

$.ajax({
    url: "/banks",
    dataType: "json",
    success: function(data){
    ko.applyBindings(bannerModel, $("nav")[0]);
    bannerModel.username(data.username);
    bannerModel.bankNames(data.banks);
    bannerModel.loadFromCookie();
    }
});
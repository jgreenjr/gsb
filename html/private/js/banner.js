var BannerModal = function () {
    this.username = ko.observable('');
    this.bankNames = ko.observableArray([]);
    this.bankName = ko.observable('');

    this.loadFromCookie = function () {
        var cookies = document.cookie.split(';');
        var bname = '';
        for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split('=')
            if (parts[0] == ' defaultBank')
        {
                bname = parts[1];
            }
            if (parts[0] == ' currentBank')
        {
                bname = parts[1];
                break;
            }
        }
         var bid = '';
        for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split('=')
            if (parts[0] == ' currentBankid')
        {
                bid = parts[1];
                break;
            }
         
        }
        this.SetBankName({bankName: bname, bankId: bid});
    }

    this.SetBankName = function (item) {
        document.cookie = 'currentBank=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        document.cookie = 'currentBank=' + item.Name;
        document.cookie = 'currentBankid' + item.bankId;
        bannerModel.bankName(item)
    }

    this.DoThis = ko.computed(function () {
        if (this.bankName())
        {
            console.log(this.bankName());
            selectedBankName = this.bankName().bankName;
            selectedBankId = this.bankName().bankId;
            if (needBankData)
                populateBank();
        }
    }
    , this)

    this.logout = function () {
        $.ajax({
            url: '/logout',
            success: function (data) {
                document.cookie = 'sessionKey=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                window.location = 'login.html'
            }
        });
    }
}

var bannerModel = new BannerModal();

$.ajax({
    url: '/bank',
    dataType: 'json',
    success: function (data) {
        ko.applyBindings(bannerModel, $('nav')[0]);
        //bannerModel.username(data.username);
        console.log(data);
        bannerModel.bankNames(data);
        bannerModel.loadFromCookie();
    }
});

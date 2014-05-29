exports.CreateCategoriesManager = function(json){
    var backingData = json;
    this.AddCategory = function(cat)
    {
        for(var ctr = 0; ctr < backingData.length; ctr++)
        {
            if(backingData[ctr].name > cat.name)
            {
                backingData.splice(ctr, 0, cat);
                return;
            }
        }
        backingData.push(cat);
    }
    
    this.GetResponse = function(type, responseHandler){
        switch(type){
            case "html":
                break;
            case "json":
                responseHandler.SendResponse(200, JSON.stringify(backingData));
                break;
        }
    }
    return this;
}

var testrunner = require("./testrunner.js");
var url = require("url");
var ResponseHandler = require("./ResponseHandler.js");

testrunner.Test("Check Get Types (html)", function(){
    var request = {headers:{accept:"text/html"}, url:"http://example.com/asdf"};
    
    var rm = ResponseHandler.CreateResponseHandler(request, {})
    
    testrunner.Assert.IsEqual("text/html", rm.responseType);
    testrunner.Assert.IsEqual("text/html", rm.errorResponseType);
    
    });
    
    
testrunner.Test("Check Get Types (json)", function(){
    var request = {headers:{accept:"application/json"}, url:"http://example.com/asdf"};
    
    var rm = ResponseHandler.CreateResponseHandler(request, {})
    
    testrunner.Assert.IsEqual("application/json", rm.responseType);
    testrunner.Assert.IsEqual("application/json", rm.errorResponseType);
    
    });
    
        
testrunner.Test("Check Get Types (js)", function(){
    var request = {headers:{accept:"application/json"}, url:"http://example.com/js.js"};
    
    var rm = ResponseHandler.CreateResponseHandler(request, {})
    
    testrunner.Assert.IsEqual("application/javascript", rm.responseType);
    testrunner.Assert.IsEqual("text/html", rm.errorResponseType);
    
    });
exports.results = {ran: 0, passed: 0, failed: 0, asserts:0};
exports.PassOff = false;

exports.Test = function (text, test){
      exports.results.ran++;   
     try{
     var result = test();
    
    if(result === undefined || result.passed)
    {
        if(!exports.PassOff)
            console.log(text+"-Result: Passed");
        exports.results.passed++;
    }
    else if(!result.passed)
    {
        exports.results.failed++;
        console.log(text+"-Result: Failed: " + result.message);
    }
  }catch(exception){
  	 exports.results.failed++;
        console.log(text+"-Result: Failed: " + exception);
	}

}

exports.createPass = function() { return {passed: true};}

exports.createResult = function(message) {return {passed: false, message: message}; }
    
exports.Assert = {
    IsTrue: function (statement, message){exports.results.asserts++; if(!statement) { throw message; }},
   
    IsEqual: function(expected, actual){
        exports.results.asserts++;
        if(expected!=actual)
        {
            throw "expected: "+expected + "\nActual:" + actual;
        }
    },
    IsEqualArray: function(expected, actual){
        exports.results.asserts++;
    	if(expected.length != actual.length)
    	{
    		 throw "expected: "+expected + "\nActual:" + actual;
    	}
    	for(var i = 0; i < expected.length; i ++){
    		if(expected[i] != actual[i]){
    			throw "expected: "+expected + "\nActual:" + actual;
    		}
    	}
    }
};

exports.IsTestFile = function (fileName){
    var length = fileName.length - 8;
    if(length < 0)
        return false;
    return (fileName.substr(length).toLowerCase() == "tests.js")
}

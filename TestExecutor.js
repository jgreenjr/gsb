//TestExecutor

var fs = require('fs');
var testrunner = require("./testrunner.js");
var modresults = [];
var allresults = {module: "All", ran: 0, passed: 0, failed: 0, asserts: 0,
                    getString: function(){ return "Mod: "+ this.module + " Ran: "+ this.ran+ "("+ this.asserts+ " Asserts) Passed: "+ this.passed+ " Failed: "+ this.failed;},
                    Add: function(addition){ this.ran += addition.ran; this.passed+= addition.passed; this.failed += addition.failed;this.asserts += addition.asserts;}
                    }
fs.readdir(".", function(err, files){
    for(var i=0; i < files.length; i++){
        if(testrunner.IsTestFile(files[i])){
            testrunner.results = {module: files[i], ran: 0, passed: 0, failed: 0,asserts: 0, getString:function(){ return "Mod: "+ this.module + " Ran: "+ this.ran+ "("+ this.asserts+ " Asserts) Passed: "+ this.passed+ " Failed: "+ this.failed;}};
            console.log("Test Mod: " + files[i])
            require("./" + files[i]);
            modresults.push(testrunner.results);
            allresults.Add(testrunner.results);
        }
    }
    console.log("-----summary----")
    for(var i=0; i < modresults.length; i++){
    	 if(modresults[i].failed != 0)
       console.log(modresults[i].getString())
    }
    console.log(allresults.getString());
    
});

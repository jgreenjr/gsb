var testrunner = require("./testrunner.js");
var CategoriesManager = require("./CategoriesManager.js");

testrunner.PassOff = true;

testrunner.Test("Should Allow addition to list of categories",function(){
    var categoriesData = [];
    
    var cm = CategoriesManager.CreateCategoriesManager(categoriesData);
    
    cm.AddCategory({name:"category"});
    
    testrunner.Assert.IsEqual(1, categoriesData.length);
    
    })
    
    testrunner.Test("Should Add cats in alpha order",function(){
    var categoriesData = [];
    
    var cm = CategoriesManager.CreateCategoriesManager(categoriesData);
    
    cm.AddCategory({name:"categoryB"});
     cm.AddCategory({name:"categoryA"});
    
    testrunner.Assert.IsEqual(2, categoriesData.length);
     testrunner.Assert.IsEqual("categoryA", categoriesData[0].name);
     testrunner.Assert.IsEqual("categoryB", categoriesData[1].name);
    })
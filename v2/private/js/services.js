/**
 * Created by greenj on 7/3/15.
 */
app.service("SharedDataService", function(){
    this.data = {};
    this.setData = function(key, value){
        this.data[key] = value
        this.watcher(this.data);
    };

    this.watcher = function (){

    };
});
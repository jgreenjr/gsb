var express = require('express');
var app = express();

var port = process.env.PORT;
if(process.argv[2])
{
    port = process.argv[2]
}

app.get("/",function (req, res) {
  res.send('Hello World!')
});

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
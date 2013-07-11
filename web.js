var express = require('express');
var fs = require('fs');
var file = ('index.html');

var app = express.createServer(express.logger());

var mesg = function (err, file) {

var buffer = new Buffer(fs.readFileSync(file));

return(buffer.toString('utf-8'));

};


app.get('/', function(request, response) {
  response.send(mesg());

});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());


app.get('/', function(request, response) {
<<<<<<< HEAD
  
=======

>>>>>>> 109c4ac6fd56fb4ded8167b518fcc2d3e92e64a6
    var buffer = new Buffer(fs.readFileSync('./index.html'));
    response.send(buffer.toString('utf8'));
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


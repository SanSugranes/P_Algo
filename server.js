var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/P_LabWeb/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
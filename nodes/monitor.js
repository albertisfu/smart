module.exports = function(RED) {

	 "use strict";

/**var express = require('express.io');
var app = express();

app.http().io();

app.io.route('ready', function(req) {
    req.io.broadcast('new visitor')
})



app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

*/

var io  = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
  socket.on('subscribe', function (data) {
    console.log('Subscribing to ');

  });
});

    function Monitor(config) {


        var id;
        var var1;

        RED.nodes.createNode(this,config);
        this.valor = config.valor;
        var var2;
        var cons = parseInt(this.valor);  //aqui obtenemos el valor con el cual comparar
        var node = this;

        this.on('input', function(msg) {




        });
    }
    RED.nodes.registerType("monitor",Monitor);
}
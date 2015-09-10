module.exports = function(RED) {

	 "use strict";



    function Monitor(config) {

var express = require('express');
var app = express();

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

app.use(express.static('./files'));

app.get('/', function(req, res) {

    res.render('index.html');
});

//var io = require("socket.io")(server);

var  io = require('socket.io').listen(server);

   /*function handleClient(socket) {
    // we've got a client connection
    socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
}
*/

//io.on("connection", handleClient);



        var id;
        var var1;
        RED.nodes.createNode(this,config);
        this.valor = config.valor;
        var var2;
        var cons = parseInt(this.valor);  //aqui obtenemos el valor con el cual comparar
        var node = this;

  this.on("close", function() { //Funcion para parar envio de mensaje de conexion al parar flow
  server.close()
  console.log("adios");
        });

        this.on('input', function(msg) {

 io.emit("message", msg.payload);


        });
    }
    RED.nodes.registerType("monitor",Monitor);
}
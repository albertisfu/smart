module.exports = function(RED) {

	 "use strict";

    function Decremento(n) {

        RED.nodes.createNode(this,n);
        this.valor = n.valor;
        this.noti = n.noti;
        var arg1;
        var arg2;
        var id;
        var varnoti;
        var var1;
        var var2;
        var node = this;


this.on('input', function(msg) { //Ejecutar al recibir mensaje

msg.topic = "decre";
msg.payload = msg.payload;
node.send([msg]);


        });
    }
    RED.nodes.registerType("decremento",Decremento);
}
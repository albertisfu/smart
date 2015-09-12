module.exports = function(RED) {

	 "use strict";

    function Incremento(n) {

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
    
msg.topic = "incre";
msg.payload = msg.payload;
node.send([msg]); //enviamos los 2 mensajes


        });
    }
    RED.nodes.registerType("incremento",Incremento);
}
module.exports = function(RED) {

	 "use strict";

    function Counter(config) {
        var id;
id = (1+Math.random()*4294967295).toString(16); //cambiar por un valor que llegue en el mensaje configuración y conexion
        var var1;
var topic2 = (1+Math.random()*42949);
        RED.nodes.createNode(this,config);
        this.valor = config.valor;
        var var2;
        var cons = parseInt(this.valor);  //aqui obtenemos el valor con el cual comparar
        var node = this;
        this.on('input', function(msg) { //Ejecutar al recibir mensaje

var1 = msg.payload;

var msg2 = {topic:topic2,payload:""};
msg.payload= var1;

msg2.payload = cons;
            //msg.payload = msg.payload;

            node.send([msg,msg2]); //enviamos los 2 mensajes
        });
    }
    RED.nodes.registerType("contador",Counter);
}
module.exports = function(RED) {

	 "use strict";

    function ServoMotor(config) {
        var id;
id = (1+Math.random()*4294967295).toString(16); //cambiar por un valor unico de dispocitivo similar a la mac que llegue en el mensaje configuración y conexion
        var var1;

        RED.nodes.createNode(this,config);


        var node = this;
        this.on('input', function(msg) { //Ejecutar al recibir mensaje

var1 = msg.payload;

msg.payload = "{"+"i:"+id+";"+"g:"+var1+"}"; 

            //msg.payload = msg.payload;

            node.send(msg); //enviamos los 2 mensajes
        });
    }
    RED.nodes.registerType("servomotor",ServoMotor);
}
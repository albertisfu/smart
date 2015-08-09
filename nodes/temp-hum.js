module.exports = function(RED) {

	 "use strict";

    function TempHum(config) {

        var var1;
        var var2;
        var i; 
        var topic2;
        RED.nodes.createNode(this,config);

    function parse(cadena, index, respuesta) {  //Funcion para separa mensaje tipo a:9999;b:8888
    var val = new Array ();
    var val1 = new Array ();
    var def = new Array ();
    var i;
    var j;
    var pos = cadena.indexOf("{");
    var pos1 = cadena.lastIndexOf("}");

if (pos != -1 && pos1 != -1){

var mensaje = cadena.substring(pos+1,pos1);
//console.log(mensaje);
var vari = mensaje.split(';');
    for (i = 0; i < vari.length; i++) { 
        val = vari[i].split(':');
        for (j = 0; j < val.length; j++) {
            if (j == 1){val1 = val[j];}         
            }
        def = def.concat(val1);
        } 
        respuesta(def[index]);
} 

        } 

        var node = this;
        this.on('input', function(msg) { //Ejecutar al recibir mensaje

        parse(msg.payload, 0, function(resultado){ //llamamos funcion para identificar el primer mensaje que llegue y asignarlo a topic1
        var1 = resultado; });

        parse(msg.payload, 1, function(resultado){ //llamamos funcion para identificar el segundo mensaje que llegue y asignarlo a topic1
        var2 = resultado; });

topic2 = msg.topic + "-2"; //definimos el topic del segundo mensaje para usar como identificador
var msg2 = {topic:topic2,payload:""}; //Delclaremos el segundo mensaje
msg.payload = var1; //asignamos el primer valor var1 al payload del primer mensaje
msg2.payload = var2; //asignamos el segundo valor var2 al payload del segundo mensaje
        
            //msg.payload = msg.payload;

            node.send([ msg , msg2 ]); //enviamos los 2 mensajes
        });
    }
    RED.nodes.registerType("temp-hum",TempHum);
}
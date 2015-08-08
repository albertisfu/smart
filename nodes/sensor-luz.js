module.exports = function(RED) {

	 "use strict";

    function SensorLuz(config) {

        var var1;
    	var luz;
        var i;
        RED.nodes.createNode(this,config);

    function parse(cadena, index, respuesta) {  //Funcion para separa mensaje tipo a:9999;b:8888
    var val = new Array ();
    var val1 = new Array ();
    var def = new Array ();
    var i;
    var j;
    var vari = cadena.split(';');
    for (i = 0; i < vari.length; i++) { 
        val = vari[i].split(':');
        for (j = 0; j < val.length; j++) {
            f (j == 1){val1 = val[j];}         
            }
        def = def.concat(val1);
        } 
        respuesta(def[index]);
        } 

        var node = this;
        this.on('input', function(msg) {

        parse(msg.payload, 1, function(resultado){ //llamamos funcion para identificar el primer mensaje que llegue y asignarlo a topic1
        var1 = resultado; });

        msg.payload = var1;
            //msg.payload = msg.payload;

            node.send(msg);
        });
    }
    RED.nodes.registerType("sensor-luz",SensorLuz);
}
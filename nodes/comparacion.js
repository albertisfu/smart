module.exports = function(RED) {

	 "use strict";
    
    function Comparacion(config) {

        RED.nodes.createNode(this,config);
var executed = false;
        this.valor = config.valor;
        this.op = config.op;
        var val;
        var res;
        var func = parseInt(this.op);  //aqui obtenemos el tipo de funcion que realizaremos
        var node = this;
        var topic1;
        var arg1;
        var arg2;


        function topics(topic, respuesta) {  //Funcion para identificar un topic y poder clasificar mensajes, solo se ejecuta una vez
                if (!executed) {
            executed = true;
           
          var res = topic;
         respuesta(res);

        } 
    }


        this.on('input', function(msg) { //se ejecuta al recibir un mensaje

        topics(msg.topic, function(resultado){ //llamamos funcion para identificar el primer mensaje que llegue y asignarlo a topic1
        topic1 = resultado; });

        //console.log(topic1); 
        //console.log(msg.topic);

        if (msg.topic == topic1)  //Si el mensaje que llegua es topic 1 entonces asignamos el valor a arg1
        {
            arg1 = parseInt(msg.payload);
        }


        else {  //si no es topic1 el mensaje que llega entonces lo asignamos a arg2
            arg2 = parseInt(msg.payload);
        }
         //val= parseInt(msg.payload);
         //var arg1 = val;
         //var arg2 = fijo;

    switch (func) { //comparaciones
    case 0:
       if (arg1 == arg2){  res = 1;} else { res = 0;}
        break;
    case 1:
        if (arg1 > arg2){ res = 1;} else {res = 0;}
        break;
    case 2:
        if (arg1 < arg2){ res = 1;} else {res = 0;}
        break;
    case 3:
       if (arg1 >= arg2){ res = 1;} else {res = 0;}
        break;
    case 4:
        if (arg1 <= arg2){ res = 1;} else {res = 0;}
        break;
    case 5:
        if (arg1 != arg2){ res = 1;} else {res = 0;}
        break;
    case 6:
       if (arg1 && arg2){ res = 1;} else {res = 0;}
        break;

    case 7:
       if (arg1 || arg2){ res = 1;} else {res = 0;}
        break;
    case 8:
       if (!arg1){ res = 1;} else {res = 0;}
        break;
    case 9:
       res = 0;
        break;
    case 10:
      res = 1;
        break;

    default:
       res = 1;

}
    msg.payload = res; //Asignamos al payload el valor de resultante de la comparacion



            node.send(msg); //enviamos el mensaje
        });
    }
    RED.nodes.registerType("compara-2",Comparacion);
}
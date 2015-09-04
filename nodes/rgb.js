module.exports = function(RED) {

     "use strict";
    


    function Comparacion(config) {

        RED.nodes.createNode(this,config);
var executed = false;
        this.sid = sid;
        this.f1 = f1;
        this.f2 = f2;
        this.f3 = f3;
        this.rgbr = rgbr;
        this.rgbg = rgbg;
        this.rgbb = rgbb;


        var val;
        var res;
        var func = parseInt(this.f1);  //aqui obtenemos el tipo de funcion que realizaremos
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



    msg.payload = "{"+"i:"+sid+";"+"x:"+f1+"y:"+f2+";"+"z:"+f3+"r:"+rgbr+";"+"g:"+rgbg+"b:"+rgbb+";"+"}"; ; //Asignamos al payload el valor de resultante de la comparacion
                //i = id unica, f1= operacion a realizar blink(3), static(1), fade(2) ,  f2 = tiempo encendido en ms, f3 = tiempo apagado en ms, r= color r, g = volor g, b = color b


            node.send(msg); //enviamos el mensaje
        });
    }






    RED.nodes.registerType("rgb-sensor",Comparacion);
}




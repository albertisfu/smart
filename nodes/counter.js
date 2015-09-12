module.exports = function(RED) {

	 "use strict";

    function Counter(n) {

        RED.nodes.createNode(this,n);
        this.valor = n.valor;
        this.noti = n.noti;
        var arg1;
        var arg2;
        var id;
        var varnoti;
        var var1;
        var var2;
        var actual = parseInt(this.valor);
        var inicio = parseInt(this.valor);
        var notifi = parseInt(this.noti);  //aqui obtenemos el valor con el cual comparar
        var node = this;


this.on('input', function(msg) { //Ejecutar al recibir mensaje


if (msg.topic == "incre")  //Si el mensaje que llegua es topic 1 entonces asignamos el valor a arg1
        {
            
            actual +=1;
        }


        else if (msg.topic == "decre") {  //si no es topic1 el mensaje que llega entonces lo asignamos a arg2
           
           actual -=1;
        }

   else if (msg.topic == "reset") {  //si no es topic1 el mensaje que llega entonces lo asignamos a arg2
           
           actual = 0;
        }

  if(actual == notifi)
  { varnoti =1;}      
 else {varnoti = 0;}

 msg.topic = "evento";
var msg1 = {topic:"cuenta",payload:""};
var msg2 = {topic:"noti",payload:""};

msg.payload= msg.payload;
msg1.payload = actual;
msg2.payload = varnoti;
            //msg.payload = msg.payload;

            node.send([msg,msg1,msg2]); //enviamos los 2 mensajes
        });
    }
    RED.nodes.registerType("contador",Counter);
}
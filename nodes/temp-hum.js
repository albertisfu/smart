module.exports = function(RED) {

	 "use strict";

  var connectionPool = require("./core/io/lib/mqttConnectionPool");
    var isUtf8 = require('is-utf8');



    function TempHum(n) {
        RED.nodes.createNode(this,n);
        this.topic = n.topic;
        this.broker = n.broker;
        this.qos = n.qos || null;
        this.retain = n.retain;
        this.idu = n.idu;
        this.brokerConfig = RED.nodes.getNode(this.broker);


        var var1;
        var var2;
        var i; 
        var topic2;

        ////////PArse

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


  function conect(payload, respuesta) {  //Funcion para identificar un topic y poder clasificar mensajes, solo se ejecuta una vez
                if (!executed) {
            executed = true;

            if(payload=="ok"){ var res = true;
         }

else{var res=false;}
         respuesta(res);
         

        } 
    }





//////

 if (this.brokerConfig) {
            this.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
            this.client = connectionPool.get(this.brokerConfig.broker,this.brokerConfig.port,this.brokerConfig.clientid,this.brokerConfig.username,this.brokerConfig.password);
            var node = this;

           var msg = {topic:"",payload:"",qos:null,retain:false};




    if (node.idu) {
                        msg.topic = node.idu;
                        console.log(msg.topic);
                   }

                    msg.payload = "{"+"t:"+"test"+"}"; 

               if ( msg.hasOwnProperty("payload")) {
                    if (msg.hasOwnProperty("topic") && (typeof msg.topic === "string") && (msg.topic !== "")) { // topic must exist
                        this.client.publish(msg);  // send the message
                    }
                    else { node.warn(RED._("mqtt.errors.invalid-topic")); console.log("error");}
                }




            if (this.topic) {
                this.client.subscribe(this.topic,2,function(topic,payload,qos,retain) {
                    if (isUtf8(payload)) { payload = payload.toString(); }
                    var msg = {topic:topic,payload:payload,qos:qos,retain:retain};
                    if ((node.brokerConfig.broker === "localhost")||(node.brokerConfig.broker === "127.0.0.1")) {
                        msg._topic = topic;
                    }
                    
//////

          
         if(msg.payload=="ok"){node.status({fill:"green",shape:"dot",text:"common.status.connected"});}




                    
         


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


///////

                }, this.id);
                this.client.on("connectionlost",function() {
                    node.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
                });

                if (this.client.isConnected()) {
                    node.status({fill:"green",shape:"dot",text:"common.status.connected"});
                } else {
                    this.client.connect();
                }
            }



            else {
                this.error(RED._("mqtt.errors.not-defined"));
            }
        } else {
            this.error(RED._("mqtt.errors.missing-config"));
        }
        this.on('close', function() {
            if (this.client) {
                this.client.unsubscribe(this.topic,this.id);
                this.client.disconnect();
            }
        });


        //////
    }
    RED.nodes.registerType("temp-hum",TempHum);




        function MQTTBrokerNode(n) {
        RED.nodes.createNode(this,n);
        this.broker = n.broker;
        this.port = n.port;
        this.clientid = n.clientid;
        if (this.credentials) {
            this.username = this.credentials.user;
            this.password = this.credentials.password;
        }
    }
    RED.nodes.registerType("mqtt-brokersen",MQTTBrokerNode,{
        credentials: {
            user: {type:"text"},
            password: {type: "password"}
        }
    });




}





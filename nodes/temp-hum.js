module.exports = function(RED) {

	 "use strict";

    var connectionPool = require("./core/io/lib/mqttConnectionPool");
    var isUtf8 = require('is-utf8');


    function TempHum(n) {
       
        RED.nodes.createNode(this,n);
        this.idcentral = n.idcentral;
        this.broker = n.broker;
        this.qos = n.qos || null;
        this.retain = n.retain;
        this.idmodulo = n.idmodulo;
        this.brokerConfig = RED.nodes.getNode(this.broker);
        var var1;
        var var2;
        var topic2;

        //////// Funcion Parse

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

/// Funcion al desplegar el flow

    if (this.brokerConfig) { 
            this.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
            this.client = connectionPool.get(this.brokerConfig.broker,this.brokerConfig.port,this.brokerConfig.clientid,this.brokerConfig.username,this.brokerConfig.password);
            var node = this;
            var msg = {topic:"",payload:"",qos:null,retain:false};

    if (node.idcentral) { //Identificamos si existe el id unico para usar como topic hacia el modulo
                        msg.topic = node.idcentral;
                         //console.log(msg.topic);
                   }

            msg.payload = "{"+"t:"+"test"+"}"; //mensaje a enviar al modulo

            if ( msg.hasOwnProperty("payload")) { //validamos si tenemos un payload y topic
                    if (msg.hasOwnProperty("topic") && (typeof msg.topic === "string") && (msg.topic !== "")) { // topic must exist
                        this.client.publish(msg);  // OJOOO send the message, se mandara la clave para crear el topic tokenizado.
                    }
                    else { 
                        node.warn(RED._("mqtt.errors.invalid-topic")); 
                        console.log("error");
                    }
                }

//OJO22 aqui asiganremos el nuevo topic generado a this.topic
///Funcion que responde al recibir un mensaje con el topic suscrito

        if (this.topic) { 
            this.client.subscribe(this.topic,2,function(topic,payload,qos,retain) {
            if (isUtf8(payload)) { payload = payload.toString(); }
            var msg = {topic:topic,payload:payload,qos:qos,retain:retain};
            if ((node.brokerConfig.broker === "localhost")||(node.brokerConfig.broker === "127.0.0.1")) {
                        msg._topic = topic;
            }          
//////Revisamos que el primer mensaje que llegue sea un ok o algun mensaje de respuesta para indicar que se conecto correctamente.
//tal vez sea conveniente agregar un token o algo similar para asegurarnos que el mensaje viene de un nodo confiable y si no viene 
//de un nodo confiable simplemente no hacer node.send()
                if(msg.payload=="ok"){
                    node.status({fill:"green",shape:"dot",text:"common.status.connected"});
                }


            parse(msg.payload, 0, function(resultado){ //funcion parse para sacarlos datos del formato {a:2323;b:323}
            var1 = resultado; });
            parse(msg.payload, 1, function(resultado){ 
            var2 = resultado; });
            topic2 = msg.topic + "-2"; //definimos el topic del segundo mensaje para usar como identificador
            var msg2 = {topic:topic2,payload:""}; //Delclaremos el segundo mensaje
            msg.payload = var1; //asignamos el primer valor var1 al payload del primer mensaje
            msg2.payload = var2; //asignamos el segundo valor var2 al payload del segundo mensaje
                    
            node.send([ msg , msg2 ]); //enviamos los 2 mensajes



            }, this.id);

            ///funciones al perder conexion
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
    }
    RED.nodes.registerType("temp-hum",TempHum);


///Funcion Broker

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





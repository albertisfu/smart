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
        this.topic = n.idmodulo;
        this.brokerConfig = RED.nodes.getNode(this.broker);
        var var1;
        var var2;
        var topic2;
        var sensor1;
var  sendto=false;

/****
Para este caso de sensores
los mensajes de plataforma al modulo se enviran via "topic idcentral"
los mensajes del modulo a la plataforma se recibiran via "topic idmodulo"

*****/
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


function loop(var1) {   ///funcion que envia constantemente mensaje al modulo central hasta avisar que esta disponible
    if(sendto==false){
    var1=node.client.publish(msgconf, function(return1){ });
      }
}

  this.on("close", function() { //Funcion para parar envio de mensaje de conexion al parar flow
    console.log("start")
            clearInterval(refreshIntervalId);  
        });

/// Funcion al desplegar el flow

    if (this.brokerConfig) { 
            this.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
            this.client = connectionPool.get(this.brokerConfig.broker,this.brokerConfig.port,this.brokerConfig.clientid,this.brokerConfig.username,this.brokerConfig.password);
            var node = this;
             var msgconf = {topic:"",payload:"",qos:null,retain:false};

    if (node.idcentral) { //Identificamos si existe el id unico para usar como topic hacia el modulo
                       msgconf.topic = node.idcentral;
                         //console.log(msg.topic);
                   }


//var decimal = parseInt(hexString, 16);
            ///Plantilla mensaje "{:idmodulo;:menconf;:var;}"        
           msgconf.payload = "{"+":"+node.idmodulo+";:"+"start"+"}";// mensaje a enviar al modulo con id del modulo xbee: 

            if (  msgconf.hasOwnProperty("payload")) { //validamos si tenemos un payload y topic
                    if ( msgconf.hasOwnProperty("topic") && (typeof  msgconf.topic === "string") && ( msgconf.topic !== "")) { // topic must exist
                    }
                    else { 
                        node.warn(RED._("mqtt.errors.invalid-topic")); 
                        console.log("error");
                    }
                }

///podemos tener dos opciones de conexion inicial, una es enviando este mensaje cada medio segundo hasta recibir una respuesta se desactiva, si recibimos
//respuesta quiere decir que si llego el mensaje, la otra opcion es tener el topic guardado en el modulo y mandarlo al central que sera el que se suscriba

       // var  sendto=false;

    var refreshIntervalId = setInterval(function() {   //llamamos funcion conexion
    loop(function(var1){ }); } , 3000);


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

            if(msg.payload=="oktopic"){ //al recibir este mensaje especial ponemos en verde el modulo significa que el modulo xbee se ha conectado al central
                    
                 clearInterval(refreshIntervalId);  
               sendto=true;
            node.status({fill:"green",shape:"dot",text:"common.status.connected"});  
                    console.log(msg.payload);
            }

///en el parse cero se encuentra la direccion del modulo

            parse(msg.payload, 1, function(resultado){ //funcion parse para sacarlos datos del formato {a:2323;b:323}
            sensor1 = resultado; });
            console.log(sensor1);
            parse(msg.payload, 2, function(resultado){ //funcion parse para sacarlos datos del formato {a:2323;b:323}
            var1 = resultado; });
          
            parse(msg.payload, 3, function(resultado){ 
            var2 = resultado; });


if(sensor1 == "am") {
            topic2 = msg.topic + "-2"; //definimos el topic del segundo mensaje para usar como identificador
            var msg2 = {topic:topic2,payload:""}; //Delclaremos el segundo mensaje
            if(var1 && var2){  //solo enviamos el mensaje si contiene un valor util
            var1 = parseInt(var1);   
            var2 = parseInt(var2); 
            msg.payload = var1; //asignamos el primer valor var1 al payload del primer mensaje
            msg2.payload = var2; //asignamos el segundo valor var2 al payload del segundo mensaje
            node.send([ msg , msg2 ]); //enviamos los 2 mensajes
            }   
        }
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
    RED.nodes.registerType("mqtt-broker-temp",MQTTBrokerNode,{
        credentials: {
            user: {type:"text"},
            password: {type: "password"}
        }
    });
}


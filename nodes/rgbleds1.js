module.exports = function(RED) {

     "use strict";
    


    function RGB(n) {

        RED.nodes.createNode(this,n);
var executed = false;
        this.sid = n.sid;
        this.f1 = n.f1;
        this.f2 = n.f2;
        this.f3 = n.f3;
        this.hexa = n.hexa;

        var val;
        var res;
        var func = parseInt(this.f1);  //aqui obtenemos el tipo de funcion que realizaremos
        var node = this;
        var topic1;
        var arg1;
        var arg2;
        var hexa = this.hexa;

 var  sendto=false;
    //////
    function loop(var1) {   ///funcion que envia constantemente mensaje al modulo central hasta avisar que esta disponible
        if(sendto==false){
        var1=node.client.publish(msgconf, function(return1){ });
          }
 }
    //this.on("close", function() { //Funcion para parar envio de mensaje de conexion al parar flow
    //console.log("start")
      //      clearInterval(refreshIntervalId);  
       //});

    /*this.on('input', function(msg) { //Ejecutar al recibir mensaje

        var1 = msg.payload;

        msg.payload = "{"+"g:"+var1+"}"; 

            //msg.payload = msg.payload;

            node.send(msg); //enviamos los 2 mensajes
        });*/

 if (this.brokerConfig) { 
            this.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
            this.client = connectionPool.get(this.brokerConfig.broker,this.brokerConfig.port,this.brokerConfig.clientid,this.brokerConfig.username,this.brokerConfig.password);
            var node = this;
            var msgconf = {topic:"",payload:"",qos:null,retain:false};

    if (node.idcentral) { //Identificamos si existe el id unico para usar como topic hacia el modulo
        msgconf.topic = node.idcentral;
        }

    msgconf.payload = "{"+":"+node.idmodulo+";:"+"startr"+"}";// mensaje a enviar al modulo con id del modulo xbee: 

   // var refreshIntervalId = setInterval(function() {   //llamamos funcion conexion
    //loop(function(var1){ }); } , 1000); 


///Funcion que responde al recibir un mensaje con el topic suscrito

        if (this.topic) { 
            this.client.subscribe(this.topic,2,function(topic,payload,qos,retain) {
            if (isUtf8(payload)) { payload = payload.toString(); }
            var msg = {topic:topic,payload:payload,qos:qos,retain:retain};
            if ((node.brokerConfig.broker === "localhost")||(node.brokerConfig.broker === "127.0.0.1")) {
                        msg._topic = topic;
            }          

            if(msg.payload=="oktopicr"){ //al recibir este mensaje especial ponemos en verde el modulo significa que el modulo xbee se ha conectado al central
                //clearInterval(refreshIntervalId);  
               sendto=true;
                    node.status({fill:"green",shape:"dot",text:"common.status.connected"});  
                    console.log(msg.payload);
            }   }, this.id);

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


             this.on("input",function(msg) {

                console.log("gola");
                
                if (node.idcentral) {
                    msg.topic = node.idcentral;
                }
                msg.payload = "{"+":"+node.idmodulo+";:"+hexa+"}"

                if ( msg.hasOwnProperty("payload")) {
                    if (msg.hasOwnProperty("topic") && (typeof msg.topic === "string") && (msg.topic !== "")) { // topic must exist
                        //node.client.publish(msgconf);
                        node.client.publish(msg);  // send the message
                    }
                    else { node.warn(RED._("mqtt.errors.invalid-topic")); }
                }
            });


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
  

    RED.nodes.registerType("rgbleds",RGB);


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
    RED.nodes.registerType("mqtt-broker-rgbleds",MQTTBrokerNode,{ 
        credentials: {
            user: {type:"text"},
            password: {type: "password"}
        }
    });


}



module.exports = function(RED) {

	 "use strict";

    function SensorLuz(config) {

    	var luz

        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {

        	msg.payload = msg.payload;
            node.send(msg);
        });
    }
    RED.nodes.registerType("sensor-luz",SensorLuz);
}
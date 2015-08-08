module.exports = function(RED) {

	 "use strict";
    
    function ComparacionFija(config) {

        RED.nodes.createNode(this,config);
var executed = false;
        this.valor = config.valor;
        this.op = config.op;
        var val;
        var res;
        var fijo = parseInt(this.valor);  //aqui obtenemos el valor con el cual comparar
        var func = parseInt(this.op);  //aqui obtenemos el tipo de funcion que realizaremos
        var node = this;
        var topic1;
        var arg1;
        var arg2;

        this.on('input', function(msg) { //se ejecuta al recibir un mensaje

         val= parseInt(msg.payload); //obtenemos el valor del mensaje
         var arg1 = val;
         var arg2 = fijo;

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
    RED.nodes.registerType("compara-1",ComparacionFija);
}
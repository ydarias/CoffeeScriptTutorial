var http = require('http');

http.createServer(function(request, response){
    var exercise = {
        title: 'Condicionales',
        description: "Crea una función llamada 'isAna' que devuelva true para la entrada 'Ana' y false " +
            "para todas las demás.",
        rootFunction: 'isAna',
        tests: [
            {input: 'Ana', output: true},
            {input: 'Pepe', output: false}
        ]
    };

    response.writeHead(200, {
    		'Content-Type': 'application/json',
    		'Cache-Control': 'no-cache',
    		'Connection': 'keep-alive',
    		'Access-Control-Allow-Origin': '*',
    		'Access-Control-Allow-Credentials': 'true'});
    response.end(JSON.stringify(exercise));
}).listen(8080);

console.log('Server listening ...');
var http = require('http'),
    url = require('url');

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    if (uri === '/user') {
        var successMessage = {
            result:'Success'
        };
        returnJSON(response, successMessage);
    } else {
        var exercise = {
            title:'Condicionales',
            description:"Crea una función llamada 'isVerdad' que devuelva true para la entrada 'Verdad' y false " +
                "para todas las demás.",
            rootFunction:'isVerdad',
            tests:[
                {input:'Verdad', output:true},
                {input:'No verdad', output:false}
            ]
        };
        returnJSON(response, exercise);
    }
}).listen(8080);

console.log('Server listening ...');

function returnJSON(response, jsonMessage) {
    response.writeHead(200, {
        'Content-Type':'application/json',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true'});
    response.end(JSON.stringify(jsonMessage));
}
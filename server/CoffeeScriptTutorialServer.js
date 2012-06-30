var http = require('http');

http.createServer(function(request, response){

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello little world!!!");
}).listen(8080);

console.log('Server listening ...');
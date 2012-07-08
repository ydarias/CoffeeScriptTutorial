var express = require('express'),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;

var PORT = 8080,
    MONGO_SERVER = 'localhost',
    MONGO_PORT = 27017;

var server = new Server(MONGO_SERVER, MONGO_PORT, {auto_reconnect:true});

var db = new Db('coffeeScriptTutorial', server);

db.open(function (err, db) {
    if (!err) {
        console.log('Conexión con la base de datos abierta ...');
        loadServer(db);
    } else {
        console.log('Se ha producido un ERROR al conectar con la base de datos ...');
    }
});

function loadServer(db) {
    var app = express.createServer();

    app.get('/user', function (request, response) {
        console.log('Obteniendo la lista de usuarios inscritos ...');
        findActiveUsers(db, response);
    });

    app.post('/user', function (request, response) {
        console.log('Intentando crear un nuevo usuario ...');
        createNewUser(db, request, response);
    });

    app.get('/exercise', function (request, response) {
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
        buildSuccessfulResponse(response, exercise);
    });

    app.listen(PORT);

    console.log('El servidor está arrancado y escuchando en el puerto ' + PORT + ' ...');


}

function findActiveUsers(db, response) {
    db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, documents) {
            buildSuccessfulResponse(response, documents);
        });
    });
}

function createNewUser(db, request, response) {
    request.on('data', function (data) {
        try {
            console.log(data.toString());

            var givenUser = JSON.parse(data);

            var user = {
                username:givenUser.username
            };

            db.collection('users', function (err, collection) {
                collection.findOne({username:user.username}, function (errFind, item) {
                    if (item) {
                        var error = {
                            errorMessage: 'El usuario indicado ya existe',
                            exception: null
                        };
                        buildErroneousRequestResponse(response, error);
                    } else {
                        collection.insert(user, function (errInsert, result) {
                            if (errInsert) {
                                var error = {
                                    errorMessage:'El usuario indicado ya existe',
                                    exception:errInsert
                                };
                                buildErroneousRequestResponse(response, error);
                            } else {
                                var success = {
                                    successMessage:'El usuario ' + user.username + ' se ha creado correctamente',
                                    result:result
                                };
                                buildSuccessfulResponse(response, success);
                            }
                        });
                    }
                });
            });
        } catch (e) {
            var error = {
                errorMessage:'No se ha podido crear el usuario indicado, probablemente la request no es correcta',
                exception:e
            };
            buildErroneousRequestResponse(response, error);
        }
    });
}

function buildSuccessfulResponse(response, jsonMessage) {
    console.log('Successful request - ' + jsonMessage.successMessage);

    response.writeHead(200, {
        'Content-Type':'application/json',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true'});
    response.end(JSON.stringify(jsonMessage));
}

function buildErroneousRequestResponse(response, jsonMessage) {
    console.log('Erroneous request - ' + jsonMessage.errorMessage);

    response.writeHead(400, {
        'Content-Type':'application/json',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true'});
    response.end(JSON.stringify(jsonMessage));
}


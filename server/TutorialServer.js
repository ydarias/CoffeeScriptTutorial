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
        console.log('Recuperando ejercicios ...');
        buildSuccessfulResponse(response, Exercises[0]);
    });

    app.post('/exercise', function (request, response) {
        console.log('Guardando resultado del ejercicio ...');
        saveExerciseStatus(db, request, response);
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
            var givenUser = JSON.parse(data);

            var user = User.createInstance(givenUser.username);

            db.collection('users', function (err, collection) {
                collection.findOne({username: user.username}, function (errFind, item) {
                    if (item) {
                        var error = Message.buildError('El usuario indicado ya existe');
                        buildErroneousResponse(response, error);
                    } else {
                        collection.insert(user, function (errInsert, result) {
                            if (errInsert) {
                                var error = Message.buildError('El usuario indicado ya existe', errInsert);
                                buildErroneousResponse(response, error);
                            } else {
                                var success = Message.buildSuccess(
                                    'El usuario ' + user.username + ' se ha creado correctamente', result);
                                buildSuccessfulResponse(response, success);
                            }
                        });
                    }
                });
            });
        } catch (e) {
            var error = Message.buildError(
                'No se ha podido crear el usuario indicado, probablemente la request no es correcta', e);
            buildErroneousResponse(response, error);
        }
    });
}

function saveExerciseStatus(db, request, response) {
    request.on('data', function(data) {
        try {
            var givenExerciseResult = JSON.parse(data);

            db.collection('users', function(err, collection) {
                collection.findOne({username: givenExerciseResult.username}, function (errFind, item) {
                    var exercise = Exercise.createInstance(givenExerciseResult);
                    item.exercises.push(exercise);
                    item.points = item.points + 1;
                    item.currentExercise = item.currentExercise + 1;

                    collection.update({username: item.username}, item, {safe: true}, function(err) {
                        if (err) {
                            var error = Message.buildError('No se ha podido actualizar el usuario', err);
                            buildErroneousResponse(response, error);
                        }
                    });

                    var success = Message.buildSuccess('El ejercicio se ha guardado corretamente', item);
                    buildSuccessfulResponse(response, success);
                });
            });
        } catch (e) {
            var error = Message.buildError('Error inesperado', e);
            buildErroneousResponse(response, error);
        }
    });
}

function buildSuccessfulResponse(response, jsonMessage) {
    response.writeHead(200, {
        'Content-Type':'application/json',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true'});
    response.end(JSON.stringify(jsonMessage));
}

function buildErroneousResponse(response, jsonMessage) {
    response.writeHead(400, {
        'Content-Type':'application/json',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'true'});
    response.end(JSON.stringify(jsonMessage));
}

/**
 * User
 */

var User = User || {};

User.createInstance = function(username) {
    return {
        username: username,
        points: 0,
        currentExercise: 0,
        exercises: []
    };
};

/**
 * Message
 */

var Message = Message || {};

Message.buildSuccess = function(message, result) {
    console.log('SUCCESS: ' + message);

    return {
        successMessage: message,
        result: result
    };
};

Message.buildError = function(message, e) {
    console.log('ERROR: ' + message);

    return {
        errorMessage: message,
        exception: e
    };
};

/**
 * Listado de ejercicios para el curso
 */

var Exercise = Exercise || {};

Exercise.createInstance = function(givenResult) {
    return {
        sourceCode: givenResult.sourceCode,
        exerciseCode: givenResult.exerciseCode
    }
};

var Exercises = [
    {
        title:'Condicionales',
        description:"Crea una función llamada 'isVerdad' que devuelva true para la entrada 'Verdad' y false " +
            "para todas las demás.",
        rootFunction:'isVerdad',
        tests:[
            {input:'Verdad', output:true},
            {input:'No verdad', output:false}
        ]
    }
];


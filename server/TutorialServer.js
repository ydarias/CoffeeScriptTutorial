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

    app.get('/exercise/:username', function (request, response) {
        console.log('Recuperando ejercicio actual para el usuario ' + request.params.username);
        respondCurrentExercise(db, request, response, request.params.username);
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

function respondCurrentExercise(db, request, response, username) {
    try {
        db.collection('users', function(err, collection) {
            collection.findOne({username: username}, function (errFind, item) {
                try {
                    var exercise = Exercises[item.currentExercise];
                    buildSuccessfulResponse(response, exercise);
                } catch (e) {
                    var error = Message.buildError('El mensaje recibido no contiene los campos esperados', e);
                    buildErroneousResponse(response, error);
                }
            });
        });
    } catch (e) {
        var error = Message.buildError('No se ha podido recuperar el ejercicio actual', e);
        buildErroneousResponse(response, error);
    }
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
        title:'Condicionales (1)',
        description:"Crea una función llamada 'isVerdad' que devuelva true para la entrada 'Verdad' y false " +
            "para todas las demás.",
        rootFunction:'isVerdad',
        tests:[
            {input:'Verdad', output:true},
            {input:'No verdad', output:false}
        ]
    },
    {
        title:'Condicionales (2)',
        description:"Crea una función llamada 'isPar' que dado un número, devuelva true para las entradas de números " +
            "pares y false para todas las demás.",
        rootFunction:'isPar',
        tests:[
            {input:1, output:false},
            {input:2, output:true},
            {input:3, output:false},
            {input:16, output:true}
        ]
    },
    {
        title:'Bucles (1)',
        description:"Crea una función llamada 'multiplicar' que dado un array de números, devuelva como resultado el " +
            "producto de todos sus componentes.",
        rootFunction:'multiplicar',
        tests:[
            {input:[1,4,3], output:12},
            {input:[2,6,5], output:60},
            {input:[-23,5,6], output:-690}
        ]
    },
    {
        title:'Bucles (2)',
        description:"Crea una función llamada 'restar' que dado un array de números, devuelva la resta de cada uno por" +
            "el siguiente, pero teniendo en cuenta que el resultado nunca sea menor que cero.",
        rootFunction:'restar',
        tests:[
            {input:[1,4,3], output:0},
            {input:[36,6,5], output:25},
            {input:[-23,-5,-20], output:2}
        ]
    },
    {
        title:'Kata: FizzBuzz',
        description:"Escribe una función 'fizzBuzz' que cumpla lo que dice el siguiente " +
            "<a href='http://www.solveet.com/exercises/Kata-FizzBuzz/11' target='blank'>enunciado</a>.",
        rootFunction:'fizzBuzz',
        tests:[
            {input:[1,2,3,4], output:'1,2,fizz,4'},
            {input:[3,5,10,15], output:'fizz,buzz,buzz,fizzbuzz'}
        ]
    },
    {
        title:'Kata: StringCalculator',
        description:"Escribe una función 'stringCalculator' que cumpla lo que dicen los 4 primeros puntos del siguiente " +
            "<a href='http://www.solveet.com/exercises/Kata-String-Calculator/8' target='blank'>enunciado</a>",
        rootFunction:'stringCalculator',
        tests:[
            {input:'1,2,3', output:6},
            {input:'2,4\n7,1', output:14},
            {input:'//;\n1,2;3,4', output:10}
        ]
    },
];


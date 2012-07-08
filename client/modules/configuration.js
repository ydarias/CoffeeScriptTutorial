Jaml.register('configuration', function () {
    div({cls:'hero-unit'},
        h1('Configuración'),
        p('Rellena los datos solicitados en esta página para poder hacer uso de la ' +
            'aplicación')
    );

    div({id: 'execution-message'});

    form({cls:'well'},
        label('Nombre (indica un nombre para guardar la sesión en el servidor)'),
        input({id:'name'}),
        label('Dirección del servidor (ej: http://192.168.1.2:8080)'),
        input({id:'server'}),
        p(
            a({
                cls:'btn',
                href:'javascript:saveConfiguration()'
            }, 'Guardar')
        )
    );
});

function saveConfiguration() {
    var url = $('#server').val() + '/user';
    var data = {
        username:$('#name').val()
    };
    var processResponse = function (data) {
        persistConfigurationData();
    };
    var processErrorResponse = function(error, textStatus, errorThrown) {
        var errorResponse = JSON.parse(error.responseText);
        $('#execution-message').removeClass();
        $('#execution-message').addClass('alert alert-error');
        $('#execution-message').html(errorResponse.errorMessage);
    };
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
        success: processResponse,
        error: processErrorResponse
    });
}

function persistConfigurationData() {
    console.log('LocalStorage support = ' + supports_html5_storage());

    var username = $('#name').val();
    console.log('Username = ' + username);
    localStorage['username'] = username;

    var server = $('#server').val();
    console.log('Server = ' + server);
    localStorage['server'] = server;

    $('#execution-message').removeClass();
    $('#execution-message').addClass('alert alert-success');
    $('#execution-message').html('Configuración guardada correctamente');
}

Jaml.register('configuration', function () {
    div({cls:'hero-unit'},
        h1('Configuración'),
        p('Rellena los datos solicitados en esta página para poder hacer uso de la ' +
            'aplicación')
    ),

    form({cls: 'well'},
        label('Nombre (indica un nombre para guardar la sesión en el servidor)'),
        input({id: 'name'}),
        label('Dirección del servidor (ej: http://192.168.1.2:8080)'),
        input({id: 'server'}),
        p(
            a({
                cls: 'btn',
                href:'javascript:saveConfiguration()'
            }, 'Guardar')
        )
    )
});

function saveConfiguration() {
    persistConfigurationData();
}

function persistConfigurationData() {
    console.log('LocalStorage support = ' + supports_html5_storage());

    var username = $('#name').val();
    console.log('Username = ' + username);
    localStorage['username'] = username;

    var server = $('#server').val();
    console.log('Server = ' + server);
    localStorage['server'] = server;
}

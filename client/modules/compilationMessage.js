Jaml.register('compilation-message', function(message) {

    div({cls: 'alert alert-error'}, message.description + '<br/>' + message.hints)

});

Jaml.register('success-message', function() {

    div({cls: 'alert alert-success'}, '¡Genial!, lo has hecho muy bien, ¿por qué no pruebas el siguiente reto?',
        p(
            a({
                id: 'next-button',
                cls: 'btn',
                href:'javascript:getNextExercise()'
            }, 'Siguiente ejercicio')
        )
    )

});
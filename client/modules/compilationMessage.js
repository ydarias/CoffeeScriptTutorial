Jaml.register('compilation-message', function(message) {

    div({cls: 'alert alert-error'}, message.description + '<br/>' + message.hints)

});

Jaml.register('success-message', function() {

    div({cls: 'alert alert-success'},
        '¡Genial!, lo has hecho muy bien, ¿por qué no pruebas el siguiente reto?',
        a({
            id: 'next-button',
            cls: 'btn',
            href:'javascript:sendExercise()'
        }, '<i class="icon-share-alt"/> Enviar')
    )

});

Jaml.register('tutorial-complete', function() {
   div({cls: 'alert alert-success'}, '¡Enhorabuena!, has completado el tutorial ... ahora estás listo para ' +
       'convertirte en un "ninja" del CoffeeScript, sigue practicando ;-)');
});

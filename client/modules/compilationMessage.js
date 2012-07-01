Jaml.register('compilation-message', function(message) {

    div({cls: 'alert alert-error'}, message.description + '<br/>' + message.hints)

});
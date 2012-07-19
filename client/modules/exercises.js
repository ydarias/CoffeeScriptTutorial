Jaml.register('exercises', function() {
    div({cls:'hero-unit'},
        h1({id: 'exercise-title'}),
        p({id: 'exercise-description'})
    ),

    form({cls: 'well'},
        div({id: 'exercise-message'}),
        label('Código fuente'),
        textarea({id: 'source-code'}),
        p(
            a({
                cls: 'btn',
                href:'javascript:evaluateExercise()'
            },

            '<i class="icon-wrench"/> Compilar')
        )
    );
});

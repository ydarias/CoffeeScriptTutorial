Jaml.register('index', function () {
    div({cls:'hero-unit'},
        h1('CoffeeScriptTutorial'),
        p('Esta aplicación está pensada como un pequeño tutorial para aprender CoffeeScript, ' +
            'a continuación se presentarán una serie de ejercicios que se han de resolver ' +
            'utilizando dicho lenguaje ... pero antes de empezar asegurate que tienes correctamente ' +
            'configurado el servidor de pruebas que deseas utilizar.')
    ),

    div({cls:'row'},
        div({cls:'span4'},
            h2('Configuración'),
            p('Si deseas poder empezar los ejerciciones, asegurate antes de tener configurada la ' +
                'aplicación para poder acceder a los ejercicios en el servidor adecuado.'),
            p(
                a({cls: 'btn', href:'javascript:navigateToConfiguration()'}, 'Configurar')
            )
        ),

        div({cls:'span4'},
            h2('Ayuda'),
            p('A veces es muy difícil empezar, quizás quieras echar un vistazo antes a algún manual que ' +
                'te de una pista de por donde seguir ... siempre que quieras puedes revisar algo de ' +
                'documentación :-)'),
            p(
                a({
                    cls: 'btn',
                    href:'https://github.com/ydarias/CoffeeScriptTutorial/wiki',
                    target: '_blank'
                }, 'Ver manual')
            )
        ),

        div({cls:'span4'},
            h2('A trabajar'),
            p('Si ya tienes configurada la aplicación y tienes las ideas claras solo te queda hacer una cosa ' +
                '... empezar los ejercicios, ¡ánimo!'),
            p(
                a({cls: 'btn', href:'javascript:navigateToExercises()'}, 'Ejercicios')
            )
        )
    )
});
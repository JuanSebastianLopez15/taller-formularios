# taller-formularios

# Nombres: Juan Sebatian López y Juan Esteban Hernández

## Nivel 1 pregunta: ¿qué pasa si borras el atributo name de un campo y envías? ¿Por qué?

- Respuesta: El formulario deja enviar, pero sin el atributo name, no manda el dato al servidor. Por eso, si escribo un correo valido, la validacion continua funcionando y te permite enviar el formulario. El navegador no exige que todos los campos tengan el atributo name para permitir el envío.

## Nivel 2 pregunta: cambia :user-invalid por :invalid, recarga la página y describe la diferencia. ¿Cuál es mejor para el usuario y por qué?

- Respuesta: Vemos que en el formulario, los campos se ponen rojos sin siquiera haberlos tocado, como si hubiera tenido un error o algo, es mejor como estaba antes, con el 'user-invalid' ya que asi el formulario se ve como deberia ser, sin errores hasta que la persona que lo intente completar cometa alguna falla, no antes. Mientras que solo el 'invalid' pone los campos rojos directamente.

## Nivel 3 paso 2 pregunta: por qué se escucha submit en el formulario y no click en el botón.

- Respuesta: Se escucha el 'submit' en el formulario porque se dispara siempre que el formulario se envía, sin importar cómo. Probamos enviarlo con la tecla Enter dentro de un campo y el formulario se envió igual, aunque yo nunca hice clic en el boton. Si se escuchara el 'click' del boton, ese caso no se detectaría, porque al presionar Enter no hay ningún clic, y el formulario se enviaria sin pasar por la validacion ni por el fetch. Por eso es mejor 'submit': cubre el clic, el Enter y cualquier otra forma de enviar, y además ayuda a quien usa solo el teclado.

# Nivel 4 ¿qué ventaja tiene que las reglas sean funciones puras? ¿Por qué la validación «correo ya existe» no se puede hacer solo con atributos HTML?

- Respuesta: Que las reglas sean funciones puras tiene la ventaja de que solo dependen del valor que reciben y siempre devuelven el mismo resultado, sin tocar el DOM. Por eso son fáciles de probar sin abrir la página, se pueden reutilizar en cualquier formulario (incluso en el servidor) y mantienen separadas la lógica de validación y la forma de mostrar los errores. En cambio, la validación de «correo ya existe» no se puede hacer solo con atributos HTML. Esos atributos solo revisan el valor contra una regla fija y de forma inmediata en el navegador, mientras que saber si un correo está registrado exige consultar datos externos en el servidor y esperar su respuesta de forma asíncrona, algo que solo se logra con JavaScript.
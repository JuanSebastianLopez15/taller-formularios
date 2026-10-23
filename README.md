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

## Nivel 5 · Parte A: ¿qué demuestra esto y qué debe hacer el backend?

- Respuesta: Demuestra que la validación del navegador se puede saltar fácilmente: basta con borrar atributos en DevTools o enviar la petición directamente desde la consola con fetch. Al quitar min y max enviamos edad 5 y el servidor la aceptó, y desde la consola llegó un correo inválido y edad -3 sin pasar por el formulario. La validación del frontend sirve para ayudar al usuario, no para proteger los datos. Por eso el backend debe volver a validar todo con el mismo esquema de reglas y usar consultas parametrizadas: la consulta SQL y los datos viajan por separado, así que un texto como ' OR '1'='1 se trata solo como un valor y nunca se ejecuta como código, lo que evita la inyección SQL.

## Nivel 5 · Parte B: diferencia entre innerHTML y textContent

- Respuesta: Con innerHTML, al escribir Ana el nombre apareció en negrita: el navegador interpretó lo que escribió el usuario como HTML. Eso abre la puerta a XSS, porque alguien podría meter etiquetas o scripts maliciosos. Con textContent el texto se muestra tal cual, como Ana, sin interpretarse. Revisamos nuestro código: el único innerHTML es el de los teléfonos del nivel 4, y es seguro porque solo inserta el número ${n}, que genera nuestro propio código y no el usuario.

## Nivel 5 · Parte C: prueba de usabilidad

| # | Observación | Campo | Problema | Corrección aplicada |
|---|-------------|-------|----------|---------------------|

| 1 | Al escribir una contraseña como "abcdefgh", el formulario la rechaza y la persona no sabía por qué antes de enviar. | Contraseña | Los requisitos (8 caracteres, una letra y un número) no se ven hasta que aparece el error. | Agregamos un texto de ayuda debajo del campo: "Mínimo 8 caracteres, con al menos una letra y un número", enlazado con aria-describedby. |

| 2 | Al no marcar la casilla, el mensaje dice "Este campo es obligatorio." | Acepto términos | El mensaje no explica qué hacer para corregirlo. | Cambiamos el mensaje a "Marca la casilla para aceptar los términos." |

| 3 | Al recorrer el formulario solo con Tab, costaba ver en qué campo estaba el foco. | Todos | El foco por defecto del navegador es poco visible. | Agregamos en el CSS un contorno visible con :focus-visible. |
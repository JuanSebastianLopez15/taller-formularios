// app.js
import { validarCampo, validarFormulario, validarTelefono } from './validaciones.js';

const form = document.querySelector('#registro');
const boton = form.querySelector('button[type="submit"]');
const mensaje = document.querySelector('#mensaje');
const saludo = document.querySelector('#saludo');

const leerDatos = () => Object.fromEntries(new FormData(form));

function mostrarError(nombre, mensaje) {
  const campo = form.elements[nombre];
  const error = document.getElementById(`${nombre}-error`);
  campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  if (error) error.textContent = mensaje ?? '';
}

// ---------- Parte B · ¿El correo ya existe? ----------

// Simula al servidor: estos correos ya están registrados
const registrados = ['ana@mail.com', 'admin@mail.com'];
const correoDisponible = (email) =>
  new Promise((ok) => setTimeout(() => ok(!registrados.includes(email.toLowerCase())), 600));

const MSG_CORREO_OCUPADO = 'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?';
let correoOcupado = null; // último correo que el "servidor" dijo que ya existe

function debounce(fn, ms) {
  let espera;
  return (...args) => {
    clearTimeout(espera);
    espera = setTimeout(() => fn(...args), ms);
  };
}

const revisarCorreo = debounce(async (email) => {
  if (validarCampo('email', { email })) return; // primero el formato
  console.log('Comprobando disponibilidad de', email);
  mostrarError('email', 'Comprobando disponibilidad…');
  const libre = await correoDisponible(email);
  if (form.elements.email.value !== email) return; // la persona siguió escribiendo
  correoOcupado = libre ? null : email;
  mostrarError('email', libre ? null : MSG_CORREO_OCUPADO);
}, 500);

form.elements.email.addEventListener('input', (e) => revisarCorreo(e.target.value));

// Error del correo: primero las reglas del módulo y luego si ya está registrado
function errorCorreo(datos) {
  return validarCampo('email', datos)
    ?? (datos.email && datos.email.toLowerCase() === correoOcupado?.toLowerCase() ? MSG_CORREO_OCUPADO : null);
}

// ---------- Parte C · Varios teléfonos ----------

const lista = document.querySelector('#telefonos');
const agregarTelefono = document.querySelector('#agregar-telefono');
let siguienteId = 1; // id único, aunque se quiten teléfonos del medio

function mostrarErrorTelefono(input, msg) {
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  document.getElementById(`${input.id}-error`).textContent = msg ?? '';
}

function actualizarTelefonos() {
  // Renumera las etiquetas y desactiva el botón al llegar a 3
  [...lista.children].forEach((fila, i) => {
    fila.querySelector('label').textContent = `Teléfono ${i + 1}`;
  });
  agregarTelefono.disabled = lista.children.length >= 3;
}

agregarTelefono.addEventListener('click', () => {
  if (lista.children.length >= 3) return;
  const n = siguienteId++;
  const fila = document.createElement('div');
  fila.className = 'telefono';
  // innerHTML es seguro aquí: solo insertamos el número n, que genera nuestro código
  fila.innerHTML = `
    <label for="tel-${n}">Teléfono</label>
    <input id="tel-${n}" name="telefono" type="tel" inputmode="tel"
           autocomplete="tel" aria-describedby="tel-${n}-error">
    <button type="button" class="quitar">Quitar</button>
    <p id="tel-${n}-error" class="error" aria-live="polite"></p>`;
  lista.append(fila);
  actualizarTelefonos();
  fila.querySelector('input').focus();
});

// Delegación de eventos: un solo listener para todos los botones «Quitar»
lista.addEventListener('click', (e) => {
  if (!e.target.matches('.quitar')) return;
  e.target.parentElement.remove();
  actualizarTelefonos();
  agregarTelefono.focus(); // que el foco no se pierda al usar el teclado
});

// Valida todos los teléfonos; devuelve true si alguno tiene error
function validarTelefonos() {
  let hayError = false;
  for (const input of lista.querySelectorAll('input[name="telefono"]')) {
    const msg = validarTelefono(input.value);
    mostrarErrorTelefono(input, msg);
    if (msg) hayError = true;
  }
  return hayError;
}

// ---------- Validar al salir de cada campo ----------

form.addEventListener('focusout', (e) => {
  const { name } = e.target;
  if (!name) return;
  const datos = leerDatos();

  if (name === 'telefono') {
    mostrarErrorTelefono(e.target, validarTelefono(e.target.value));
  } else if (name === 'email') {
    mostrarError('email', errorCorreo(datos));
  } else {
    mostrarError(name, validarCampo(name, datos));
  }

  // Si cambia la contraseña, revisar otra vez la confirmación (si ya se escribió)
  if (name === 'password' && datos.confirmar) {
    mostrarError('confirmar', validarCampo('confirmar', datos));
  }
});

// ---------- Envío ----------

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = '';
  saludo.textContent = '';

  const datos = leerDatos();
  const errores = validarFormulario(datos);
  const correo = errorCorreo(datos);
  if (correo) errores.email = correo;

  // Mostrar todos los errores (y limpiar los campos que ya están bien)
  for (const nombre of ['nombre', 'email', 'password', 'confirmar', 'edad', 'pais', 'terminos']) {
    mostrarError(nombre, errores[nombre] ?? null);
  }
  const erroresTelefono = validarTelefonos();

  if (Object.keys(errores).length > 0 || erroresTelefono) {
    form.querySelector('[aria-invalid="true"]').focus(); // llevar al primer error
    return;
  }

  boton.disabled = true;
  boton.textContent = 'Enviando…';

  try {
    delete datos.confirmar; // no se envía la confirmación
    datos.telefono = new FormData(form).getAll('telefono'); // lista con todos los números
    console.log('Enviando:', JSON.stringify(datos));

    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const creado = await res.json();
    console.log('Respuesta del servidor:', creado);
    mensaje.textContent = `¡Cuenta creada! Id: ${creado.id}`;

    // Nivel 5 · Parte B
    // Inseguro: el navegador interpreta el texto como HTML
    // saludo.innerHTML = `Hola, ${datos.nombre}`;
    // Seguro: el texto se muestra tal cual
    saludo.textContent = `Hola, ${datos.nombre}`;

    form.reset();
    lista.replaceChildren();
    actualizarTelefonos();
    correoOcupado = null;
    form.querySelectorAll('[aria-invalid]').forEach((c) => c.setAttribute('aria-invalid', 'false'));
  } catch (err) {
    mensaje.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    console.error(err);
  } finally {
    boton.disabled = false;
    boton.textContent = 'Crear cuenta';
  }
});

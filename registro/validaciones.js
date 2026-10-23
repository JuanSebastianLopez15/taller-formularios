// validaciones.js
export const requerido = (msg = 'Este campo es obligatorio.') =>
 (v) => (v === undefined || v === null || String(v).trim() === '' ? msg : null);
export const longitud = (min, max) =>
 (v) => (v.length < min ? `Usa al menos ${min} caracteres.`
 : v.length > max ? `Usa como máximo ${max} caracteres.` : null);
export const formatoCorreo = () =>
(v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Escribe un correo válido, por ejemplo ana@mail.com.');
export const rangoEntero = (min, max) => (v) => {
 const n = Number(v);
 if (!Number.isInteger(n)) return 'Escribe un número entero.';
 if (n < min) return `El valor mínimo es ${min}.`;
 if (n > max) return `El valor máximo es ${max}.`;
 return null;
};
export const igualA = (otroCampo, msg) =>
 (v, datos) => (v === datos[otroCampo] ? null : msg);
// Las 7 reglas del registro en un solo lugar
export const reglas = {
 nombre: [requerido(), longitud(3, 60)],
 email: [requerido(), formatoCorreo()],
 password: [requerido(), longitud(8, 64) /* TODO: regla letra + número */],
 confirmar: [requerido(), igualA('password', 'Las contraseñas no coinciden.')],
 edad: [requerido(), rangoEntero(18, 120)],
 pais: [requerido('Elige un país.')],
 terminos: [/* TODO: debe ser 'on' (checkbox marcado) */],
};
// Devuelve el primer error del campo, o null
export function validarCampo(nombre, datos) {
 for (const regla of reglas[nombre] ?? []) {
 const error = regla(datos[nombre] ?? '', datos);
 if (error) return error;
 }
 return null;
}
// Devuelve un objeto { campo: mensaje } solo con los campos con error
export function validarFormulario(datos) {
 const errores = {};
 for (const nombre of Object.keys(reglas)) {
 const error = validarCampo(nombre, datos);
 if (error) errores[nombre] = error;
 }
 return errores;
}

// app.js
import { validarCampo, validarFormulario } from './validaciones.js';
const form = document.querySelector('#registro');
const leerDatos = () => Object.fromEntries(new FormData(form));
function mostrarError(nombre, mensaje) {
 const campo = form.elements[nombre];
 const error = document.getElementById(`${nombre}-error`);
 campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
 if (error) error.textContent = mensaje ?? '';
}
form.addEventListener('focusout', (e) => {
 if (!e.target.name) return;
 mostrarError(e.target.name, validarCampo(e.target.name, leerDatos()));
});

// Simula al servidor: estos correos ya están registrados
const registrados = ['ana@mail.com', 'admin@mail.com'];
const correoDisponible = (email) =>
 new Promise((ok) => setTimeout(() =>
ok(!registrados.includes(email.toLowerCase())), 600));
function debounce(fn, ms) {
 let espera;
 return (...args) => {
 clearTimeout(espera);
 espera = setTimeout(() => fn(...args), ms);
 };
}
const revisarCorreo = debounce(async (email) => {
 if (validarCampo('email', { email })) return; // primero el formato
 mostrarError('email', 'Comprobando disponibilidad…');
 const libre = await correoDisponible(email);
 mostrarError('email', libre ? null : 'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?');
}, 500);
form.elements.email.addEventListener('input', (e) => revisarCorreo(e.target.value));

const lista = document.querySelector('#telefonos');
document.querySelector('#agregar-telefono').addEventListener('click', () => {
 if (lista.children.length >= 3) return;
 const n = lista.children.length + 1;
 const fila = document.createElement('div');
 fila.innerHTML = `
 <label for="tel-${n}">Teléfono ${n}</label>
 <input id="tel-${n}" name="telefono" type="tel" inputmode="tel"
autocomplete="tel">
 <button type="button" class="quitar">Quitar</button>`;
 lista.append(fila);
 fila.querySelector('input').focus();
});
// Delegación de eventos: un solo listener para todos los botones «Quitar»
lista.addEventListener('click', (e) => {
 if (e.target.matches('.quitar')) e.target.parentElement.remove();
});
// TODO: validar los teléfonos. Ojo: varios campos con el mismo name
// se leen con new FormData(form).getAll('telefono'), no con get().

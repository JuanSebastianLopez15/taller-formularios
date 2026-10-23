// validaciones.js
// Cada regla recibe el valor (y todos los datos) y devuelve un mensaje de error o null.
// Son funciones puras: no tocan el DOM.

export const requerido = (msg = 'Este campo es obligatorio.') =>
  (v) => (v === undefined || v === null || String(v).trim() === '' ? msg : null);

export const longitud = (min, max) =>
  (v) => (v.length < min ? `Usa al menos ${min} caracteres.`
    : v.length > max ? `Usa como máximo ${max} caracteres.` : null);

export const formatoCorreo = () =>
  (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Escribe un correo válido, por ejemplo ana@mail.com.');

export const letraYNumero = () =>
  (v) => (/[A-Za-z]/.test(v) && /\d/.test(v) ? null : 'Usa al menos una letra y un número.');

export const rangoEntero = (min, max) => (v) => {
  const n = Number(v);
  if (!Number.isInteger(n)) return 'Escribe un número entero.';
  if (n < min) return `El valor mínimo es ${min}.`;
  if (n > max) return `El valor máximo es ${max}.`;
  return null;
};

export const igualA = (otroCampo, msg) =>
  (v, datos) => (v === datos[otroCampo] ? null : msg);

// Un checkbox marcado llega en FormData con el valor 'on'; si no está marcado, no llega.
export const marcado = (msg) =>
  (v) => (v === 'on' ? null : msg);

export const formatoTelefono = () =>
  (v) => (/^\+?\d{7,15}$/.test(v) ? null : 'Escribe de 7 a 15 dígitos, con + opcional. Ej: +573001234567.');

// Las 7 reglas del registro en un solo lugar
export const reglas = {
  nombre: [requerido(), longitud(3, 60)],
  email: [requerido(), formatoCorreo()],
  password: [requerido(), longitud(8, 64), letraYNumero()],
  confirmar: [requerido(), igualA('password', 'Las contraseñas no coinciden.')],
  edad: [requerido(), rangoEntero(18, 120)],
  pais: [requerido('Elige un país.')],
  terminos: [marcado('Marca la casilla para aceptar los términos.')],
};

// Reglas de cada teléfono (campos dinámicos)
export const reglasTelefono = [requerido('Escribe el teléfono o quita el campo.'), formatoTelefono()];

// Aplica una lista de reglas y devuelve el primer error, o null
function primerError(lista, valor, datos = {}) {
  for (const regla of lista) {
    const error = regla(valor ?? '', datos);
    if (error) return error;
  }
  return null;
}

// Devuelve el primer error del campo, o null
export function validarCampo(nombre, datos) {
  return primerError(reglas[nombre] ?? [], datos[nombre], datos);
}

// Devuelve el primer error de un teléfono, o null
export function validarTelefono(valor) {
  return primerError(reglasTelefono, valor);
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

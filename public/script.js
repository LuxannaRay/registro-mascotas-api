const API_URL = '/api/mascotas';

// ---------- Instancia de Axios ----------
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

// ---------- Capa de manejo de errores (interceptor) ----------
// Centraliza cómo se interpreta cualquier error que venga de una petición Axios,
// ya sea error de respuesta del servidor, de red, o de configuración.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    let mensaje = 'Ocurrió un error inesperado. Intenta nuevamente.';

    if (error.response) {
      // El servidor respondió con un código de error (400, 404, 409, 500, etc.)
      mensaje = error.response.data?.error || `Error del servidor (${error.response.status}).`;
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (servidor caído, sin conexión)
      mensaje = 'No se pudo conectar con el servidor. Verifica que esté corriendo.';
    } else {
      mensaje = error.message;
    }

    return Promise.reject(new Error(mensaje));
  }
);

// ---------- Navegación entre pestañas ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('activo'));
    btn.classList.add('activo');
    document.getElementById(btn.dataset.tab).classList.add('activo');
  });
});

// ---------- Notificaciones ----------
function mostrarNotificacion(mensaje, esError = false) {
  const el = document.getElementById('notificacion');
  el.textContent = mensaje;
  el.classList.toggle('error', esError);
  el.classList.add('mostrar');
  setTimeout(() => el.classList.remove('mostrar'), 3500);
}

// ---------- Pintar tarjetas de mascotas ----------
function pintarMascotas(contenedor, mascotas) {
  contenedor.innerHTML = '';

  if (!mascotas || mascotas.length === 0) {
    contenedor.innerHTML = '<p class="mensaje-vacio">No hay mascotas para mostrar.</p>';
    return;
  }

  mascotas.forEach(m => {
    const div = document.createElement('div');
    div.className = 'tarjeta-mascota';
    div.innerHTML = `
      <div class="icono">🐶</div>
      <h3>${m.nombre}</h3>
      <p class="rut">Dueño: ${m.rut}</p>
    `;
    contenedor.appendChild(div);
  });
}

// ---------- Listar todas ----------
document.getElementById('btnListarTodas').addEventListener('click', async () => {
  const contenedor = document.getElementById('contenedorMascotas');
  try {
    const { data } = await api.get('');
    pintarMascotas(contenedor, data);
  } catch (error) {
    mostrarNotificacion(error.message, true);
  }
});

// Cargar listado al iniciar
document.getElementById('btnListarTodas').click();

// ---------- Buscar por nombre ----------
document.getElementById('formBuscarNombre').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { nombre } = Object.fromEntries(new FormData(e.target));
  const contenedor = document.getElementById('resultadoBusqueda');
  try {
    const { data } = await api.get('', { params: { nombre } });
    pintarMascotas(contenedor, [data]);
  } catch (error) {
    contenedor.innerHTML = '';
    mostrarNotificacion(error.message, true);
  }
});

// ---------- Buscar por rut ----------
document.getElementById('formBuscarRut').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { rut } = Object.fromEntries(new FormData(e.target));
  const contenedor = document.getElementById('resultadoBusqueda');
  try {
    const { data } = await api.get('', { params: { rut } });
    pintarMascotas(contenedor, data);
  } catch (error) {
    contenedor.innerHTML = '';
    mostrarNotificacion(error.message, true);
  }
});

// ---------- Registrar nueva mascota ----------
document.getElementById('formRegistrar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  try {
    const { data } = await api.post('', datos);
    mostrarNotificacion(`Mascota "${data.nombre}" registrada correctamente.`);
    e.target.reset();
    document.getElementById('btnListarTodas').click();
  } catch (error) {
    mostrarNotificacion(error.message, true);
  }
});

// ---------- Eliminar por nombre ----------
document.getElementById('formEliminarNombre').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { nombre } = Object.fromEntries(new FormData(e.target));
  try {
    const { data } = await api.delete('', { params: { nombre } });
    mostrarNotificacion(data.mensaje);
    e.target.reset();
    document.getElementById('btnListarTodas').click();
  } catch (error) {
    mostrarNotificacion(error.message, true);
  }
});

// ---------- Eliminar por rut ----------
document.getElementById('formEliminarRut').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { rut } = Object.fromEntries(new FormData(e.target));
  try {
    const { data } = await api.delete('', { params: { rut } });
    mostrarNotificacion(data.mensaje);
    e.target.reset();
    document.getElementById('btnListarTodas').click();
  } catch (error) {
    mostrarNotificacion(error.message, true);
  }
});

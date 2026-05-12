const API_URL = 'http://localhost:3000/api/accesos';

// ── Notificaciones ──
function mostrarNotif(mensaje, tipo = 'success') {
  const container = document.getElementById('notif-container');
  const iconos = { success: '✅', error: '❌', info: 'ℹ️' };

  const notif = document.createElement('div');
  notif.className = `notif notif-${tipo}`;
  notif.innerHTML = `
    <span class="notif-icon">${iconos[tipo]}</span>
    <span>${mensaje}</span>
  `;

  notif.onclick = () => notif.remove();
  container.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ── Formatear fecha ──
function formatearFecha(fecha) {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCitas();
  document.getElementById('btn-nuevo').onclick    = mostrarFormulario;
  document.getElementById('btn-cancelar').onclick = ocultarFormulario;
  document.getElementById('btn-guardar').onclick  = guardarCita;
  document.getElementById('buscador').addEventListener('input', function() {
    const texto = this.value.toLowerCase();
    const filas = document.querySelectorAll('#tabla-citas tr');
    filas.forEach(fila => {
      const contenido = fila.textContent.toLowerCase();
      fila.style.display = contenido.includes(texto) ? '' : 'none';
    });
  });
});

async function cargarCitas() {
  // Mostrar spinner mientras carga
  document.getElementById('tabla-citas').innerHTML = `
    <tr><td colspan="8">
      <div class="spinner-overlay">
        <div class="spinner"></div>
        <span>Cargando registros...</span>
      </div>
    </td></tr>`;

  try {
    const res   = await fetch(API_URL);
    const citas = await res.json();
    renderTabla(citas);
  } catch (err) {
    
    document.getElementById('tabla-citas').innerHTML = `
      <tr><td colspan="8"
        style="text-align:center;color:#aaa;padding:30px">
        ⚠️ No se pudo conectar al servidor
      </td></tr>`;
  }
}

function renderTabla(citas) {
  const tbody = document.getElementById('tabla-citas');
  if (citas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"
      style="text-align:center;color:#aaa;padding:30px">
      Sin registros. Haz clic en "+ Nuevo Registro".
    </td></tr>`;
    return;
  }
  tbody.innerHTML = citas.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${c.vigilante       || '—'}</td>
      <td>${c.empleadoVisitar || '—'}</td>
      <td>${c.visitante || c.nombre || '—'}</td>
      <td>${c.empresa         || '—'}</td>
      <td>${formatearFecha(c.fecha)} ${c.hora}</td>
      <td>
        <span class="badge badge-${(c.estado || 'pendiente').toLowerCase()}">
          ${c.estado || 'Pendiente'}
        </span>
      </td>
      <td style="display:flex; gap:6px">
        <button class="btn btn-primary btn-sm"
          onclick="editarCita('${c.id}')">✏️ Editar</button>
        <button class="btn btn-danger btn-sm"
          onclick="eliminarCita('${c.id}')">🗑️ Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function mostrarFormulario() {
  limpiarFormulario();
  document.getElementById('form-titulo').textContent  = 'Nueva Cita';
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('form-error').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ocultarFormulario() {
  document.getElementById('formulario').style.display = 'none';
  limpiarFormulario();
}

async function guardarCita() {
  const id              = document.getElementById('cita-id').value;
  const vigilante       = document.getElementById('vigilante').value.trim();
  const empleadoVisitar = document.getElementById('empleadoVisitar').value.trim();
  const visitante       = document.getElementById('visitante').value.trim();
  const empresa         = document.getElementById('empresa').value.trim();
  const correo          = document.getElementById('correo').value.trim();
  const fecha           = document.getElementById('fecha').value;
  const hora            = document.getElementById('hora').value;
  const motivo          = document.getElementById('motivo').value.trim();
  const estado          = document.getElementById('estado').value;
  const errorEl         = document.getElementById('form-error');

  if (!vigilante || !visitante || !fecha || !hora) {
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';

  const datos  = { vigilante, empleadoVisitar, visitante, empresa, correo, fecha, hora, motivo, estado };
  const url    = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    ocultarFormulario();
    cargarCitas();
    mostrarNotif(id ? 'Cita actualizada correctamente' : 'Cita creada correctamente', 'success');
  } catch (err) {
    mostrarNotif('Error al guardar. Verifica que el servidor esté corriendo.', 'error');
  }
}

async function editarCita(id) {
  try {
    const res  = await fetch(`${API_URL}/${id}`);
    const cita = await res.json();

    document.getElementById('cita-id').value          = id;
    document.getElementById('vigilante').value         = cita.vigilante      || '';
    document.getElementById('empleadoVisitar').value  = cita.empleadoVisitar || '';
    document.getElementById('visitante').value         = cita.visitante      || '';
    document.getElementById('empresa').value           = cita.empresa        || '';
    document.getElementById('correo').value            = cita.correo         || '';
    document.getElementById('fecha').value             = cita.fecha;
    document.getElementById('hora').value              = cita.hora;
    document.getElementById('motivo').value            = cita.motivo         || '';
    document.getElementById('estado').value            = cita.estado         || 'Pendiente';

    document.getElementById('form-titulo').textContent  = 'Editar Cita';
    document.getElementById('formulario').style.display = 'block';
    document.getElementById('form-error').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    mostrarNotif('No se pudo cargar la cita para editar.', 'error');
  }
}

async function eliminarCita(id) {
  if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarCitas();
    mostrarNotif('Registro eliminado correctamente', 'success');
  } catch (err) {
    mostrarNotif('Error al eliminar.', 'error');
  }
}

function limpiarFormulario() {
  ['cita-id','vigilante','empleadoVisitar','visitante',
   'empresa','correo','fecha','hora','motivo'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('estado').value = 'Pendiente';
}
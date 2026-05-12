# 🏢 Nexus Guard — Sistema de Control de Acceso a Oficinas

## 👥 Integrantes del Equipo
> Ordenados alfabéticamente por apellido

| Apellido, Nombre | Rol |
|---|---|
| _(Sanz Hernandez Ignacio)_ | Desarrollador Frontend |
| _(Claudia Guadalupe Romero)_ | Desarrollador de Autenticación |
| _(Apellido, Nombre)_ | Desarrollador de Lógica CRUD |
| _(Apellido, Nombre)_ | Administrador de Base de Datos |
| _(Apellido, Nombre)_ | Arquitecto de Software |
| _(Apellido, Nombre)_ | Líder de Proyecto |

---

## 1. Introducción

### Propósito
El sistema permite gestionar y registrar el acceso de visitantes externos a las instalaciones de una organización, facilitando el control, seguimiento y aprobación de citas entre visitantes y empleados internos.

### Alcance
El sistema cubre los siguientes procesos:

- **Autenticación restringida:** Solo los 6 empleados autorizados pueden iniciar sesión en el sistema. El acceso está controlado por una lista de correos autorizados con contraseñas encriptadas.
- **Gestión de citas:** Creación, consulta, actualización y eliminación de registros de visitas con información del vigilante, visitante, empleado a visitar, fecha, hora y estado.
- **Solicitud externa:** Formulario público que permite a visitantes externos solicitar una cita sin necesidad de cuenta, generando un folio único de seguimiento.
- **Panel de control:** Dashboard con estadísticas del día, mes y citas pendientes de aprobación, con acciones de aprobar o rechazar directamente desde la interfaz.

### Usuarios del Sistema

| Tipo de Usuario | Descripción |
|---|---|
| **Empleado Autorizado** | Uno de los 6 empleados registrados que inicia sesión para gestionar y aprobar citas |
| **Visitante Externo** | Persona ajena a la organización que solicita una cita sin necesidad de cuenta |

### Empleados Autorizados

| Nombre | Correo |
|---|---|
| Jesus Ramón Camarillo Núñez | jcamarillo@nexusguard.com, password: Nexus2024 |
| Marco Gerardo Ceballos Valdez | mceballos@nexusguard.com, password: Nexus2024 |
| Jesus Enrique Felix Olea | jfelix@nexusguard.com, password: Nexus2024 |
| Claudia Guadalupe Romero | cromero@nexusguard.com, password: Nexus2024 |
| Ignacio Sanz Hernandez | isanz@nexusguard.com, password: Nexus2024 |
| José Luis Toscano Sosa | jltoscano@nexusguard.com, password: Nexus2024 |

### Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Almacenamiento | Archivos JSON |
| Autenticación | JWT (JSON Web Tokens), bcryptjs |
| Control de versiones | Git, GitHub |
| Diseño | Figma |

---

## 2. Resumen del Sistema

Nexus Guard es una aplicación web cliente-servidor que permite a organizaciones llevar un registro digital y organizado del acceso de personas a sus oficinas. El sistema reemplaza los registros manuales en papel por una interfaz digital intuitiva que facilita la administración de visitas en tiempo real.

### Flujo General del Sistema

```
Visitante Externo                    Empleado Autorizado
       │                                    │
       ▼                                    ▼
  Solicita cita               Inicia sesión con correo
  (sin cuenta)                 autorizado y contraseña
       │                                    │
       ▼                                    ▼
  Llena formulario              Accede al Dashboard
  con sus datos                 con estadísticas
       │                                    │
       ▼                                    ▼
  Recibe folio              Aprueba o Rechaza citas
  de confirmación            Gestiona todos los registros
```

### Módulos del Sistema

**Módulo 1 — Autenticación**  
Gestiona el acceso seguro al sistema. Solo los 6 empleados preregistrados pueden iniciar sesión. Incluye inicio de sesión con token JWT de 8 horas, recuperación de contraseña por código de 4 dígitos, y protección de rutas que redirige al login si no hay sesión activa.

**Módulo 2 — Dashboard**  
Panel principal con estadísticas en tiempo real: citas del día, del mes, pendientes de aprobación y lista de próximas citas con acciones rápidas de aprobar o rechazar.

**Módulo 3 — Gestión de Citas (CRUD)**  
Módulo completo de administración con tabla de registros, buscador en tiempo real, formulario emergente para crear y editar, y notificaciones visuales de éxito o error.

**Módulo 4 — Solicitud Externa**  
Formulario público para visitantes externos con generación automática de folio de confirmación en formato SGC-XXXX.

### Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/verificar-correo` | Enviar código de recuperación |
| POST | `/api/auth/cambiar-password` | Cambiar contraseña |
| GET | `/api/accesos` | Obtener todas las citas |
| GET | `/api/accesos/:id` | Obtener una cita por ID |
| POST | `/api/accesos` | Crear nueva cita |
| PUT | `/api/accesos/:id` | Actualizar cita |
| DELETE | `/api/accesos/:id` | Eliminar cita |

---

## 3. Requisitos
> _(Esta sección la documenta el Desarrollador de Lógica CRUD)_

---

## 4. Instalación
> _(Esta sección la documenta el Arquitecto de Software)_

---

## 5. Uso del Sistema

### 🖥️ Páginas del Sistema

| Página | Archivo | Descripción |
|---|---|---|
| Login | `login.html` | Inicio de sesión para empleados autorizados |
| Recuperar Contraseña | `recuperar.html` | Restablecer contraseña olvidada |
| Dashboard | `index.html` | Panel principal con estadísticas |
| Gestión de Citas | `accesos.html` | CRUD completo de citas |
| Solicitud de Cita | `cita.html` | Formulario para visitantes externos |

---

### 🔐 Inicio de Sesión

1. Abrir `login.html` en el navegador.
2. Escribir el **correo autorizado** y **contraseña**.
3. Activar **"Recordarme"** si se desea mantener la sesión.
4. Hacer clic en **"Iniciar sesión"**.
5. El sistema redirigirá automáticamente al Dashboard.

> ⚠️ Solo los 6 empleados autorizados pueden iniciar sesión. Cualquier otro correo será rechazado.

---

### 🔑 Recuperar Contraseña

**Paso 1:** Ingresar el correo autorizado y hacer clic en **"Enviar Código"**.  
**Paso 2:** Escribir el código de 4 dígitos generado y hacer clic en **"Verificar Código"**.  
**Paso 3:** Ingresar la nueva contraseña, confirmarla y hacer clic en **"Cambiar Contraseña"**.

---

### 📊 Panel Principal (Dashboard)

| Elemento | Descripción |
|---|---|
| **Citas de Hoy** | Total de citas registradas en el día actual |
| **Citas del Mes** | Total de citas del mes en curso |
| **Aprobación Pdte.** | Citas en estado Pendiente |
| **Gestión de Citas** | Acceso directo al módulo CRUD |
| **Próximas Citas** | Últimas citas con botones Aprobar / Rechazar |

---

### 🚪 Gestión de Citas (CRUD)

| Acción | Cómo realizarla |
|---|---|
| **Crear** | Clic en "+ Nuevo Registro", llenar formulario y guardar |
| **Buscar** | Escribir en el buscador para filtrar en tiempo real |
| **Editar** | Clic en "✏️ Editar", modificar campos y guardar |
| **Eliminar** | Clic en "🗑️ Eliminar" y confirmar en el diálogo |

---

### 📅 Solicitud de Cita Externa

1. Acceder desde el Login → **"¿Eres externo? Solicita una cita aquí"**.
2. Llenar el formulario con nombre, empresa, correo, empleado a visitar, fecha, hora y motivo.
3. Hacer clic en **"Solicitar Cita"**.
4. El sistema mostrará un folio de confirmación (ej. SGC-8472).

---

### 🔓 Cerrar Sesión

Hacer clic en **"🔓 Cerrar Sesión"** en el menú lateral. El sistema elimina la sesión y redirige al Login.

> ⚠️ Si se intenta acceder al Dashboard o Gestión de Citas sin sesión activa, el sistema redirige automáticamente al Login.

---

## 6. Base de Datos (Modelado)
> _(Esta sección la documenta el Administrador de Base de Datos)_

---

## 📌 Desarrollo del Frontend

### Descripción General
El desarrollo del frontend consistió en construir todas las interfaces visuales del sistema utilizando **HTML5, CSS3 y JavaScript puro**, tomando como base el diseño elaborado en **Figma**. Se implementaron 5 páginas funcionales que cubren la experiencia completa del usuario, desde el inicio de sesión hasta la gestión de citas.

### Estructura de Archivos

```
control-acceso-oficinas/
├── assets/
│   └── logo.svg          → Logo oficial de Nexus Guard
├── css/
│   └── styles.css        → Hoja de estilos global con variables CSS
├── js/
│   └── accesos.js        → Lógica del CRUD y notificaciones
├── accesos.html          → Gestión de Citas (CRUD)
├── cita.html             → Solicitud de cita para visitantes externos
├── index.html            → Dashboard principal
├── login.html            → Inicio de sesión
└── recuperar.html        → Recuperación de contraseña
```

### Paleta de Colores

Se definió mediante variables CSS para mantener consistencia en toda la aplicación:

| Variable | Color | Uso |
|---|---|---|
| `--color-primario` | `#1A1A2E` | Fondo del sidebar |
| `--color-secundario` | `#00C48C` | Botones principales y acentos |
| `--color-acento` | `#6C63FF` | Botón "Nuevo Registro" |
| `--color-danger` | `#E74C3C` | Botones de eliminar y alertas |
| `--color-azul` | `#3498DB` | Títulos y encabezados |
| `--color-fondo` | `#F4F6F9` | Fondo general de la aplicación |

### Páginas Desarrolladas

**login.html — Inicio de Sesión**  
Página de acceso con diseño centrado. Incluye campos de correo y contraseña con íconos, opción "Recordarme", enlace a recuperación de contraseña, enlace a solicitud de cita externa, íconos de redes sociales con Font Awesome, y botón para mostrar u ocultar la contraseña. El registro de nuevos usuarios fue eliminado ya que solo los 6 empleados autorizados pueden acceder al sistema.

**recuperar.html — Recuperación de Contraseña**  
Página de 4 pasos progresivos: ingreso del correo, verificación del código de 4 dígitos, ingreso de nueva contraseña y pantalla de confirmación. Cada paso se muestra u oculta dinámicamente con JavaScript sin recargar la página.

**index.html — Dashboard**  
Panel principal que consume la API del backend para mostrar estadísticas en tiempo real. Muestra tarjetas de resumen, lista de próximas citas con botones de aprobación y rechazo, fechas en formato DD/MM/YYYY, y spinner de carga mientras se obtienen los datos.

**accesos.html — Gestión de Citas**  
Página central del CRUD con tabla de registros, buscador en tiempo real que filtra por cualquier campo, formulario emergente para crear o editar citas, menú desplegable con los 6 empleados disponibles, badges de colores para los estados, notificaciones visuales de éxito o error, y spinner de carga.

**cita.html — Solicitud Externa**  
Formulario público sin inicio de sesión. Genera automáticamente un folio único en formato SGC-XXXX y muestra pantalla de confirmación al enviar. Configurado para que Live Server no recargue la página cuando se guardan datos.

### Funcionalidades Implementadas

**Notificaciones Visuales**  
Se reemplazaron los `alert()` del navegador por notificaciones personalizadas que aparecen en la esquina superior derecha de la pantalla. Se desaparecen automáticamente en 3 segundos o al hacer clic sobre ellas.

```javascript
function mostrarNotif(mensaje, tipo = 'success') {
  const container = document.getElementById('notif-container');
  const iconos = { success: '✅', error: '❌', info: 'ℹ️' };
  const notif = document.createElement('div');
  notif.className = `notif notif-${tipo}`;
  notif.innerHTML = `<span>${iconos[tipo]}</span><span>${mensaje}</span>`;
  container.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}
```

**Buscador en Tiempo Real**  
Filtra los registros de la tabla mientras el usuario escribe, sin necesidad de hacer peticiones adicionales al servidor.

```javascript
document.getElementById('buscador').addEventListener('input', function() {
  const texto = this.value.toLowerCase();
  const filas = document.querySelectorAll('#tabla-citas tr');
  filas.forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(texto) ? '' : 'none';
  });
});
```

**Spinner de Carga**  
Se muestra un indicador animado mientras se obtienen los datos del servidor, mejorando la experiencia de usuario.

**Formato de Fecha DD/MM/YYYY**  
Las fechas almacenadas en formato `YYYY-MM-DD` se convierten al formato local para mostrarse en la tabla y el dashboard.

```javascript
function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}
```

**Protección de Rutas**  
Cada página protegida verifica si existe un token JWT en `localStorage` antes de mostrar el contenido. Si no existe, redirige al login automáticamente.

```javascript
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html';
}
```

### Decisiones de Diseño

- **Variables CSS:** Permiten cambios globales de colores desde un solo lugar.
- **Sidebar fijo:** El menú lateral permanece visible mientras el usuario hace scroll.
- **Formularios emergentes:** Los formularios del CRUD se muestran u ocultan sin cambiar de página.
- **Live Server configurado:** Se agregó `.vscode/settings.json` para que Live Server ignore la carpeta `backend/data/` y no recargue la página al guardar datos.
- **Font Awesome CDN:** Se utilizó para los íconos de redes sociales en el login.

### Comunicación con el Backend

El frontend se comunica con la API REST usando `fetch()` de JavaScript en formato JSON:

```javascript
const res = await fetch('http://localhost:3000/api/accesos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});
const data = await res.json();
```

---

## 📌 Desarrollo de Autenticación

### Descripción General
El módulo de autenticación se desarrolló en **Node.js con Express.js**. Se implementó un sistema de acceso restringido donde únicamente los 6 empleados preregistrados pueden iniciar sesión. La seguridad se garantiza con **bcryptjs** para cifrado de contraseñas y **JWT** para gestión de sesiones.

### Dependencias Utilizadas

| Paquete | Función |
|---|---|
| `express` | Framework del servidor web |
| `bcryptjs` | Cifrado de contraseñas |
| `jsonwebtoken` | Generación y verificación de tokens JWT |
| `cors` | Permite peticiones desde el frontend |
| `nodemon` | Reinicio automático del servidor al detectar cambios |

### Estructura del Módulo

```
backend/
├── data/
│   ├── usuarios.json     → 6 empleados preregistrados con contraseñas cifradas
│   └── accesos.json      → Registros de citas
├── routes/
│   └── auth.js           → Rutas y lógica de autenticación
├── server.js             → Configuración principal del servidor
└── setup.js              → Script de inicialización de empleados
```

### Script de Inicialización (setup.js)

Se creó un script que precarga los 6 empleados autorizados en el sistema con contraseñas cifradas. Este script se ejecuta una sola vez para inicializar el sistema:

```javascript
const bcrypt = require('bcryptjs');
const password = await bcrypt.hash('Nexus2024', 10);

const empleados = [
  { id: '1', nombre: 'Jesus Ramón Camarillo Núñez',  email: 'jcamarillo@nexusguard.com', password },
  { id: '2', nombre: 'Marco Gerardo Ceballos Valdez', email: 'mceballos@nexusguard.com',  password },
  // ... demás empleados
];
```

Para ejecutarlo: `node setup.js`

### Endpoints Implementados

#### POST `/api/auth/login`
Verifica las credenciales del empleado y genera un token JWT. Solo acepta los correos de los 6 empleados registrados.

```
Entrada:  { email, password }
Salida:   { token, nombre, email }
```

Proceso:
1. Buscar el correo en `usuarios.json`.
2. Si no existe, responder con error 401.
3. Comparar la contraseña ingresada con el hash usando `bcrypt.compare()`.
4. Si es válida, generar token JWT con expiración de 8 horas.
5. Retornar el token y datos del empleado.

#### POST `/api/auth/verificar-correo`
Verifica que el correo esté registrado y genera un código de recuperación de 4 dígitos. El código se guarda en **memoria** (no en archivo) para evitar que Live Server recargue la página durante el desarrollo.

```
Entrada:  { email }
Salida:   { codigo, mensaje }
```

#### POST `/api/auth/cambiar-password`
Actualiza la contraseña del empleado tras la verificación del código. La nueva contraseña se cifra antes de guardarse.

```
Entrada:  { email, password }
Salida:   { mensaje: "Contraseña actualizada exitosamente" }
```

### Seguridad Implementada

**Cifrado de contraseñas con bcryptjs**  
Las contraseñas nunca se almacenan en texto plano. Se usa `bcrypt.hash()` con 10 rondas de salt generando un hash único e irreversible. La verificación se realiza con `bcrypt.compare()`.

**Gestión de sesiones con JWT**  
Al iniciar sesión, el servidor genera un token JWT firmado con una clave secreta que:
- Se almacena en el `localStorage` del navegador.
- Expira automáticamente en 8 horas.
- Contiene el ID, nombre y correo del empleado.

**Acceso restringido a 6 empleados**  
El sistema no permite registro de nuevos usuarios. Los 6 empleados fueron preregistrados mediante el script `setup.js` con contraseña inicial `Nexus2024`. Cada empleado puede cambiar su contraseña usando la función de recuperación.

**Protección de rutas en el frontend**  
Las páginas Dashboard y Gestión de Citas verifican el token antes de mostrar el contenido:

```javascript
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html';
}
```

**Cierre de sesión seguro**  
Al cerrar sesión se eliminan el token y los datos del usuario del `localStorage`:

```javascript
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}
```

**CORS habilitado**  
Se configuró el middleware `cors` para permitir la comunicación entre el frontend (puerto 5500) y el backend (puerto 3000).

**Códigos de recuperación en memoria**  
Para evitar que Live Server recargue la página al modificar archivos JSON, los códigos de recuperación se guardan en un objeto en memoria del servidor en lugar de en el archivo de usuarios.

---

*Documento generado como parte del Producto 2 — Desarrollo de Software, Conexión con Base de Datos y Documentación de Código.*

# 🏀 HoopsREST API - Basketball Management System

¡Bienvenido a **HoopsREST**! Este proyecto es una API profesional y robusta diseñada para la gestión de equipos y jugadores de baloncesto. Implementa una arquitectura **MVC (Modelo-Vista-Controlador)** y sistemas modernos de autenticación.

## 🚀 Características Principales

- **Arquitectura MVC:** Separación clara de responsabilidades para un código mantenible y escalable.
- **Pila Tecnológica:** Node.js, Express, SQLite.
- **Autenticación Híbrida:** 
    - **JWT (JSON Web Tokens):** Para login local con email y contraseña (seguridad stateless).
    - **Google OAuth 2.0:** Integración con Google para login social mediante Passport.js.
- **Documentación Interactiva:** Integración con **Swagger UI** (OpenAPI 3.0) para probar los endpoints en tiempo real.
- **Validación de Datos:** Uso de **Joi** para asegurar la integridad de la información enviada al servidor.
- **Dashboard Web:** Interfaz moderna y dinámica construida con Vanilla JS, CSS y HTML5 para gestionar la liga de forma visual.
- **Paginación:** Sistema de paginación tanto en el servidor como en el cliente para manejar grandes volúmenes de datos.

## 📁 Estructura del Proyecto

```text
REST/
├── public/              # VISTA: Interfaz Frontend
├── scripts/             # Herramientas de mantenimiento (DB Init/Seed)
├── src/
│   ├── config/          # Configuraciones (DB, Passport)
│   ├── controllers/     # CONTROLADOR: Lógica de negocio
│   ├── middlewares/     # Seguridad y verificaciones
│   ├── models/          # MODELO: Consultas y acceso a datos (Persistence)
│   └── routes/          # Definición de Endpoints (Rutas)
├── server.js            # Punto de entrada (Express Server)
└── .env                 # Variables de entorno (Configuración)
```

## 🛠️ Instalación y Configuración

### 1. Clonar e instalar dependencias
```bash
# Instalar los paquetes necesarios
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz con el siguiente formato:
```env
PORT=3000
JWT_SECRET=tu_secreto_super_seguro
SESSION_SECRET=secreto_para_sesiones
GOOGLE_CLIENT_ID=tus_credenciales_de_google
GOOGLE_CLIENT_SECRET=tus_credenciales_de_google
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 3. Inicializar la Base de Datos
Este comando borrará cualquier rastro antiguo y creará las tablas con los equipos y jugadores estrella de la NBA.
```bash
node scripts/init_db.js
```

### 4. Iniciar el Servidor
```bash
node server.js
```

## 📖 Uso de la API

### Documentación
Una vez que el servidor esté corriendo, accede a:
👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints Principales
- **Autenticación:**
    - `POST /auth/register` - Crear cuenta.
    - `POST /auth/login` - Obtener Token JWT.
    - `GET /auth/google` - Iniciar flujo Google OAuth.
- **Jugadores:**
    - `GET /api/players` - Listado paginado.
    - `POST /api/players` (Protegido) - Añadir jugador.
- **Equipos:**
    - `GET /api/teams` - Listado de equipos.
    - `GET /api/teams/:id/players` - Ver plantilla de un equipo.
---
*Este proyecto fue diseñado para demostrar el dominio de los principios REST, seguridad OAuth2.0 y el patrón de diseño MVC en entornos Node.js.*

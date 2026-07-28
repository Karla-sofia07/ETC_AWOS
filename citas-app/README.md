# Sistema de Gestión de Citas

App web con **API en Laravel** (autenticación con Sanctum) y **frontend en HTML/CSS/JS + Bootstrap** que la consume vía `fetch`.

## Estructura del proyecto

```
citas-app/
├── backend/     -> archivos para copiar dentro de un proyecto Laravel nuevo
└── frontend/    -> HTML/CSS/JS estático, no necesita servidor especial
```

⚠️ Este sandbox no tiene acceso a Packagist, así que no pude correr `composer create-project` aquí.
Sigue estos pasos en tu máquina (necesitas PHP 8.2+, Composer y MySQL/MariaDB instalados).

## 1. Crear el proyecto Laravel

```bash
composer create-project laravel/laravel citas-backend
cd citas-backend
composer require laravel/sanctum
```

## 2. Copiar los archivos de `backend/` sobre el proyecto nuevo

Copia (sobrescribiendo) estos archivos y carpetas de `backend/` dentro de `citas-backend/`:

- `app/Models/User.php`, `Servicio.php`, `Cita.php`
- `app/Http/Controllers/Api/` (completa)
- `app/Http/Requests/` (completa)
- `app/Http/Middleware/EnsureUserIsAdmin.php`
- `database/migrations/` (borra antes las migraciones default de `users`, `cache` y `jobs` que traigan conflicto de nombre, o simplemente sustituye la de `users`)
- `database/seeders/DatabaseSeeder.php`
- `routes/api.php`
- `bootstrap/app.php`
- `config/cors.php`
- `.env.example` (copia los valores relevantes a tu `.env`)

## 3. Configurar base de datos

Crea la base de datos `citas_app` en MySQL y ajusta las credenciales en `.env` (usa `.env.example` como guía).

## 4. Instalar Sanctum y migrar

```bash
php artisan install:api
php artisan migrate:fresh --seed
```

Esto crea las tablas y siembra:
- Un usuario **administrador**: `admin@citas.com` / `admin123`
- 3 servicios de ejemplo

## 5. Levantar el servidor

```bash
php artisan serve
```

La API quedará en `http://localhost:8000/api`.

## 6. Levantar el frontend

El frontend es estático. Puedes:
- Abrir `frontend/index.html` directamente en el navegador, o
- Servirlo con `npx live-server frontend` o la extensión "Live Server" de VS Code (recomendado, evita problemas de CORS con `file://`)

Si cambias el puerto o dominio del backend, actualiza `API_BASE_URL` en `frontend/js/api.js`.

## Resumen de endpoints de la API

| Método | Endpoint                          | Descripción                              | Acceso        |
|--------|------------------------------------|-------------------------------------------|---------------|
| POST   | /api/auth/register                 | Registrar cliente                         | Público       |
| POST   | /api/auth/login                    | Iniciar sesión (devuelve token)           | Público       |
| POST   | /api/auth/logout                   | Cerrar sesión                             | Autenticado   |
| GET    | /api/auth/me                       | Usuario autenticado                       | Autenticado   |
| GET    | /api/servicios                     | Listar servicios                          | Público       |
| POST   | /api/servicios                     | Crear servicio                            | Admin         |
| PUT    | /api/servicios/{id}                | Editar servicio                           | Admin         |
| DELETE | /api/servicios/{id}                | Eliminar servicio                         | Admin         |
| GET    | /api/citas?fecha=YYYY-MM-DD        | Listar citas (propias o todas si es admin)| Autenticado   |
| POST   | /api/citas                         | Agendar cita                              | Autenticado   |
| PUT    | /api/citas/{id}                    | Editar cita                               | Autenticado   |
| DELETE | /api/citas/{id}                    | Cancelar cita                             | Autenticado   |
| GET    | /api/clientes                      | Listar clientes                           | Admin         |
| GET    | /api/clientes/{id}/historial       | Historial de citas de un cliente          | Admin         |

## Funcionalidades cubiertas

- ✅ Registro e inicio de sesión con token (Sanctum)
- ✅ Rutas privadas protegidas con middleware `auth:sanctum` y `admin`
- ✅ CRUD de servicios
- ✅ Agendar, editar y cancelar citas
- ✅ Consultar citas por fecha (filtro en `/api/citas?fecha=`)
- ✅ Historial de citas por cliente
- ✅ Validación de datos con Form Requests (mensajes en español)
- ✅ Consumo de la API desde el frontend con `fetch`, sin recargar la página
- ✅ Arquitectura MVC / cliente-servidor con JSON como formato de intercambio

## Siguientes pasos sugeridos (para la Unidad III / entrega final)

1. Tomar capturas de pantalla del login, agenda, servicios y clientes para el reporte.
2. Probar los endpoints con Postman/Insomnia antes de conectarlos al frontend.
3. Agregar paginación a `/api/citas` y `/api/clientes` si el volumen de datos crece.
4. (Opcional) Agregar recuperación de contraseña y verificación de correo.

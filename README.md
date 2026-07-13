# Registro Civil de Mascotas — API

Servidor Node.js (Express) que registra mascotas y el rut de su dueño en un archivo JSON (`data/mascotas.json`).

## Cómo correrlo

```bash
npm install
npm start
```

Luego abrir en el navegador: **http://localhost:3000**

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/mascotas` | Retorna todas las mascotas con su dueño |
| GET | `/api/mascotas?nombre=Firulais` | Retorna la mascota con ese nombre y el rut de su dueño |
| GET | `/api/mascotas?rut=12.345.678-9` | Retorna todas las mascotas asociadas a ese rut |
| POST | `/api/mascotas` | Inserta una mascota (body: `nombre`, `rut`) |
| DELETE | `/api/mascotas?nombre=Firulais` | Elimina la mascota con ese nombre |
| DELETE | `/api/mascotas?rut=12.345.678-9` | Elimina todas las mascotas asociadas a ese rut |

## Frontend

En `public/` hay una interfaz web (HTML + CSS + Axios) con 4 pestañas: Listado, Buscar, Registrar y Eliminar.

Toda petición pasa por una instancia de Axios con un **interceptor de errores** (`public/script.js`) que traduce cualquier falla (error del servidor, sin conexión, timeout, etc.) en un mensaje claro mostrado al usuario mediante una notificación en pantalla.

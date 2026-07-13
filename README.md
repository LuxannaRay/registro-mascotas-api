# Registro Civil de Mascotas — API

## Objetivos de la aplicación

Esta aplicación consiste en una API desarrollada en Node.js (Express) que permite gestionar el registro de mascotas asociadas al rut de su dueño, utilizando un archivo JSON como medio de almacenamiento. Los objetivos específicos son:

- Registrar mascotas nuevas según su tipo (perro o gato), asociadas al nombre y al rut de su dueño.
- Consultar el listado completo de mascotas registradas.
- Buscar una mascota específica por su nombre.
- Buscar todas las mascotas registradas bajo un rut determinado.
- Eliminar una mascota por su nombre.
- Eliminar todas las mascotas asociadas a un rut.
- Proveer un frontend (HTML, CSS y Axios) que consuma la API y maneje los errores de forma centralizada mediante un interceptor.

## Autora

Fernanda Núñez

## URL del repositorio

https://github.com/LuxannaRay/registro-mascotas-api

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
| POST | `/api/mascotas` | Inserta una mascota (body: `nombre`, `rut`, `tipo`: "perro" o "gato") |
| DELETE | `/api/mascotas?nombre=Firulais` | Elimina la mascota con ese nombre |
| DELETE | `/api/mascotas?rut=12.345.678-9` | Elimina todas las mascotas asociadas a ese rut |

## Frontend

En `public/` hay una interfaz web (HTML + CSS + Axios) con 4 pestañas: Listado, Buscar, Registrar y Eliminar.

Toda petición pasa por una instancia de Axios con un **interceptor de errores** (`public/script.js`) que traduce cualquier falla (error del servidor, sin conexión, timeout, etc.) en un mensaje claro mostrado al usuario mediante una notificación en pantalla.

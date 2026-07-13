const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PUERTO = 3000;
const RUTA_DATA = path.join(__dirname, 'data', 'mascotas.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Utilidades de acceso a datos ----------

function leerMascotas() {
  const contenido = fs.readFileSync(RUTA_DATA, 'utf-8');
  return JSON.parse(contenido);
}

function guardarMascotas(mascotas) {
  fs.writeFileSync(RUTA_DATA, JSON.stringify(mascotas, null, 2), 'utf-8');
}

// ---------- GET: todas / por nombre / por rut ----------
// GET /api/mascotas                -> todas las mascotas con su dueño
// GET /api/mascotas?nombre=Firulais -> la mascota con ese nombre
// GET /api/mascotas?rut=11.111.111-1 -> todas las mascotas de ese rut
app.get('/api/mascotas', (req, res) => {
  const { nombre, rut } = req.query;
  const mascotas = leerMascotas();

  if (nombre) {
    const encontrada = mascotas.find(m => m.nombre.toLowerCase() === nombre.toLowerCase());
    if (!encontrada) {
      return res.status(404).json({ error: `No existe una mascota con el nombre "${nombre}".` });
    }
    return res.json(encontrada);
  }

  if (rut) {
    const delDueño = mascotas.filter(m => m.rut === rut);
    if (delDueño.length === 0) {
      return res.status(404).json({ error: `No hay mascotas registradas para el rut "${rut}".` });
    }
    return res.json(delDueño);
  }

  res.json(mascotas);
});

// ---------- POST: insertar mascota ----------
app.post('/api/mascotas', (req, res) => {
  const { nombre, rut } = req.body;

  if (!nombre || !rut) {
    return res.status(400).json({ error: 'Debe indicar nombre de la mascota y rut del dueño.' });
  }

  const mascotas = leerMascotas();

  const yaExiste = mascotas.some(m => m.nombre.toLowerCase() === nombre.toLowerCase());
  if (yaExiste) {
    return res.status(409).json({ error: `Ya existe una mascota registrada con el nombre "${nombre}".` });
  }

  const nuevaMascota = { nombre, rut };
  mascotas.push(nuevaMascota);
  guardarMascotas(mascotas);

  res.status(201).json(nuevaMascota);
});

// ---------- DELETE: por nombre o por rut ----------
// DELETE /api/mascotas?nombre=Firulais -> elimina esa mascota
// DELETE /api/mascotas?rut=11.111.111-1 -> elimina todas las mascotas de ese rut
app.delete('/api/mascotas', (req, res) => {
  const { nombre, rut } = req.query;
  const mascotas = leerMascotas();

  if (!nombre && !rut) {
    return res.status(400).json({ error: 'Debe indicar el parámetro "nombre" o "rut" para eliminar.' });
  }

  if (nombre) {
    const existe = mascotas.some(m => m.nombre.toLowerCase() === nombre.toLowerCase());
    if (!existe) {
      return res.status(404).json({ error: `No existe una mascota con el nombre "${nombre}".` });
    }
    const actualizadas = mascotas.filter(m => m.nombre.toLowerCase() !== nombre.toLowerCase());
    guardarMascotas(actualizadas);
    return res.json({ mensaje: `Mascota "${nombre}" eliminada correctamente.` });
  }

  if (rut) {
    const existe = mascotas.some(m => m.rut === rut);
    if (!existe) {
      return res.status(404).json({ error: `No hay mascotas registradas para el rut "${rut}".` });
    }
    const actualizadas = mascotas.filter(m => m.rut !== rut);
    guardarMascotas(actualizadas);
    return res.json({ mensaje: `Todas las mascotas del rut "${rut}" fueron eliminadas.` });
  }
});

// ---------- Manejo de rutas no encontradas ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});

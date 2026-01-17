// server/index.js
const express = require('express');
const cors = require('cors');
// const { PrismaClient } = require('@prisma/client'); // Ya no hace falta aquí si no lo usas en el test

const truckRoutes = require('./src/routes/truckRoutes'); // <--- IMPORTAR RUTAS

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- CONECTAR RUTAS ---
app.use('/api/trucks', truckRoutes); // <--- USAR RUTAS

// Ruta de prueba (la dejamos por si acaso)
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
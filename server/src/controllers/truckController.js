// server/src/controllers/truckController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener todos los camiones
const getTrucks = async (req, res) => {
  try {
    const trucks = await prisma.truck.findMany({
      orderBy: { id: 'desc' } // Los más nuevos primero
    });
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener camiones' });
  }
};

// 2. Crear un nuevo camión
const createTruck = async (req, res) => {
  try {
    const { plate, model, year, currentKm, nextRtvDate } = req.body;

    // Validación básica
    if (!plate || !model || !year) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (Patente, Modelo, Año)' });
    }

    const newTruck = await prisma.truck.create({
      data: {
        plate,
        model,
        year: parseInt(year),
        currentKm: parseInt(currentKm) || 0,
        // Convertimos el string de fecha a objeto Date
        nextRtvDate: new Date(nextRtvDate), 
        status: 'AVAILABLE'
      }
    });

    res.json(newTruck);
  } catch (error) {
    // Si la patente ya existe (error P2002 de Prisma)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un camión con esa patente' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al crear el camión' });
  }
};

// 3. Actualizar Kilometraje
const updateKm = async (req, res) => {
  try {
    const { id } = req.params; // ID del camión en la URL
    const { km } = req.body;   // Nuevo kilometraje

    if (!km) return res.status(400).json({ error: 'El kilometraje es obligatorio' });

    // Buscamos el camión actual para validar que no bajen el km (fraude/error)
    const currentTruck = await prisma.truck.findUnique({ where: { id: parseInt(id) } });
    
    if (!currentTruck) return res.status(404).json({ error: 'Camión no encontrado' });
    if (parseInt(km) < currentTruck.currentKm) {
      return res.status(400).json({ error: 'El nuevo kilometraje no puede ser menor al actual' });
    }

    // Actualizamos
    const updatedTruck = await prisma.truck.update({
      where: { id: parseInt(id) },
      data: { currentKm: parseInt(km) }
    });

    res.json(updatedTruck);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar kilometraje' });
  }
};

module.exports = { getTrucks, createTruck, updateKm };
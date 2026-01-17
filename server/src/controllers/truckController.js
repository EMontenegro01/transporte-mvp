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

    const OIL_CHANGE_INTERVAL = 15000;
    const kmValue = parseInt(currentKm) || 0;
    
    const newTruck = await prisma.truck.create({
      data: {
        plate,
        model,
        year: parseInt(year),
        currentKm: kmValue,
        lastOilChangeKm: kmValue, // Asumimos que el camión nuevo/usado ya tiene aceite
        nextOilChangeKm: kmValue + OIL_CHANGE_INTERVAL, // Próximo cambio
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

// 4. Completar cambio de aceite
const completeOilChange = async (req, res) => {
  try {
    const { id } = req.params;
    const OIL_CHANGE_INTERVAL = 15000;

    console.log(`[OIL CHANGE] Procesando cambio de aceite para camión ID: ${id}`);
    
    const truck = await prisma.truck.findUnique({ where: { id: parseInt(id) } });
    if (!truck) {
      console.log(`[OIL CHANGE] Camión no encontrado: ${id}`);
      return res.status(404).json({ error: 'Camión no encontrado' });
    }

    console.log(`[OIL CHANGE] Camión encontrado: ${truck.plate}, KM actual: ${truck.currentKm}`);

    // El próximo cambio será: km actual + 15,000
    const nextOilChangeKm = truck.currentKm + OIL_CHANGE_INTERVAL;
    
    console.log(`[OIL CHANGE] Calculando - Próximo cambio: ${nextOilChangeKm} km`);

    const updatedTruck = await prisma.truck.update({
      where: { id: parseInt(id) },
      data: {
        lastOilChangeKm: truck.currentKm,
        nextOilChangeKm: nextOilChangeKm
        // El status NO cambia - el camión permanece en MAINTENANCE
      }
    });

    console.log(`[OIL CHANGE] Camión actualizado exitosamente`);

    // Registramos en el historial
    await prisma.maintenance.create({
      data: {
        truckId: parseInt(id),
        type: 'OIL_CHANGE',
        kmAtService: truck.currentKm,
        notes: `Cambio de aceite realizado a los ${truck.currentKm} km. Próximo cambio a los ${nextOilChangeKm} km.`
      }
    });

    console.log(`[OIL CHANGE] Historial registrado`);

    res.json(updatedTruck);
  } catch (error) {
    console.error('[OIL CHANGE] Error:', error);
    res.status(500).json({ error: 'Error al completar cambio de aceite' });
  }
};

// 5. Completar RTV
const completeRtv = async (req, res) => {
  try {
    const { id } = req.params;
    const { nextRtvDate } = req.body;

    if (!nextRtvDate) {
      return res.status(400).json({ error: 'La fecha de la próxima RTV es obligatoria' });
    }

    const truck = await prisma.truck.findUnique({ where: { id: parseInt(id) } });
    if (!truck) return res.status(404).json({ error: 'Camión no encontrado' });

    const updatedTruck = await prisma.truck.update({
      where: { id: parseInt(id) },
      data: {
        lastRtvDate: truck.nextRtvDate,
        nextRtvDate: new Date(nextRtvDate)
        // El status NO cambia - el camión permanece en MAINTENANCE
      }
    });

    // Registramos en el historial
    await prisma.maintenance.create({
      data: {
        truckId: parseInt(id),
        type: 'RTV',
        kmAtService: truck.currentKm,
        notes: `RTV realizada. Próxima RTV: ${new Date(nextRtvDate).toLocaleDateString('es-AR')}`
      }
    });

    res.json(updatedTruck);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al completar RTV' });
  }
};

// 6. Enviar a mantenimiento / Devolver a flota
const sendToMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const truck = await prisma.truck.findUnique({ where: { id: parseInt(id) } });
    if (!truck) return res.status(404).json({ error: 'Camión no encontrado' });

    // Toggle: Si está en MAINTENANCE, vuelve a AVAILABLE. Si no, va a MAINTENANCE
    const newStatus = truck.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';

    const updatedTruck = await prisma.truck.update({
      where: { id: parseInt(id) },
      data: { status: newStatus }
    });

    console.log(`[STATUS] Camión ${truck.plate} cambiado de ${truck.status} a ${newStatus}`);

    res.json(updatedTruck);
  } catch (error) {
    console.error('[STATUS] Error:', error);
    res.status(500).json({ error: 'Error al cambiar estado del camión' });
  }
};

module.exports = { 
  getTrucks, 
  createTruck, 
  updateKm,
  completeOilChange,
  completeRtv,
  sendToMaintenance
};
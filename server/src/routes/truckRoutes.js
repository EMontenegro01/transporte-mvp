// server/src/routes/truckRoutes.js
const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Definimos las rutas
router.get('/', truckController.getTrucks);   // GET /api/trucks
router.post('/', truckController.createTruck); // POST /api/trucks
router.patch('/:id/km', truckController.updateKm); // PATCH /api/trucks/:id/km

module.exports = router;
// server/src/routes/truckRoutes.js
const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Definimos las rutas
router.get('/', truckController.getTrucks);   // GET /api/trucks
router.post('/', truckController.createTruck); // POST /api/trucks
router.patch('/:id/km', truckController.updateKm); // PATCH /api/trucks/:id/km
router.patch('/:id/oil-change', truckController.completeOilChange); // PATCH /api/trucks/:id/oil-change
router.patch('/:id/rtv', truckController.completeRtv); // PATCH /api/trucks/:id/rtv
router.patch('/:id/maintenance', truckController.sendToMaintenance); // PATCH /api/trucks/:id/maintenance

module.exports = router;
// Servicios de lógica de negocio para trucks
// Separar la lógica de negocio de los controllers
const { prisma } = require('../config/database');

const truckService = {
  async findAll() {
    return prisma.truck.findMany({
      orderBy: { id: 'desc' },
    });
  },

  async create(data) {
    return prisma.truck.create({ data });
  },

  async updateKm(id, km) {
    return prisma.truck.update({
      where: { id: parseInt(id) },
      data: { currentKm: parseInt(km) },
    });
  },

  async findById(id) {
    return prisma.truck.findUnique({
      where: { id: parseInt(id) },
    });
  },
};

module.exports = truckService;

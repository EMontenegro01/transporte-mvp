// Script para arreglar datos de camiones existentes
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OIL_CHANGE_INTERVAL = 15000;

async function fixTruckData() {
  console.log('🔧 Iniciando actualización de datos...\n');
  
  const trucks = await prisma.truck.findMany();
  
  console.log(`Encontrados ${trucks.length} camiones\n`);
  
  for (const truck of trucks) {
    console.log(`\n📦 Procesando: ${truck.plate}`);
    console.log(`   Km actual: ${truck.currentKm}`);
    console.log(`   Último cambio aceite: ${truck.lastOilChangeKm}`);
    console.log(`   Próximo cambio (actual): ${truck.nextOilChangeKm}`);
    
    // Calcular el próximo cambio basado en km actual
    const newNextOilChangeKm = truck.currentKm + OIL_CHANGE_INTERVAL;
    
    await prisma.truck.update({
      where: { id: truck.id },
      data: {
        lastOilChangeKm: truck.currentKm, // Asumimos que acaba de hacer el cambio
        nextOilChangeKm: newNextOilChangeKm
      }
    });
    
    console.log(`   ✅ Actualizado - Próximo cambio: ${newNextOilChangeKm} km`);
  }
  
  console.log('\n✅ Actualización completada!');
}

fixTruckData()
  .catch(e => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// client/src/utils/maintenanceLogic.js

// CONFIGURACIÓN (Esto podría venir del backend a futuro)
const OIL_CHANGE_INTERVAL = 15000; // Cambio cada 15.000 km
const OIL_WARNING_THRESHOLD = 1000; // Avisar 1.000 km antes

const RTV_WARNING_DAYS = 30; // Avisar 30 días antes de la RTV

export const getTruckState = (truck) => {
  const today = new Date();
  const rtvDate = new Date(truck.nextRtvDate);
  
  // 1. CÁLCULO DE ACEITE
  // Si nextOilChangeKm existe, usarlo. Si no, calcularlo manualmente (datos legacy)
  let nextOilChangeKm = truck.nextOilChangeKm;
  
  if (!nextOilChangeKm || nextOilChangeKm === 0) {
    // Datos legacy o camiones viejos: calcular manualmente
    nextOilChangeKm = truck.lastOilChangeKm + OIL_CHANGE_INTERVAL;
  }
  
  const kmRemaining = nextOilChangeKm - truck.currentKm;
  const kmSinceLastOil = truck.currentKm - truck.lastOilChangeKm;
  
  let oilStatus = 'OK'; // OK, WARNING, DANGER
  if (kmRemaining <= 0) oilStatus = 'DANGER';
  else if (kmRemaining <= OIL_WARNING_THRESHOLD) oilStatus = 'WARNING';

  // 2. CÁLCULO DE RTV
  // Diferencia en milisegundos convertida a días
  const diffTime = rtvDate - today; 
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  let rtvStatus = 'OK';
  if (daysRemaining < 0) rtvStatus = 'DANGER'; // Ya venció
  else if (daysRemaining <= RTV_WARNING_DAYS) rtvStatus = 'WARNING'; // Vence pronto

  // 3. ESTADO GENERAL (El peor de los dos define el color de la tarjeta)
  let generalStatus = 'OK';
  if (oilStatus === 'DANGER' || rtvStatus === 'DANGER') generalStatus = 'DANGER';
  else if (oilStatus === 'WARNING' || rtvStatus === 'WARNING') generalStatus = 'WARNING';

  return {
    oil: { status: oilStatus, kmRemaining, kmSinceLastOil, nextChangeKm: nextOilChangeKm },
    rtv: { status: rtvStatus, daysRemaining },
    generalStatus
  };
};

export const getStatusColor = (status, truckStatus) => {
  // Si el camión está en mantenimiento, siempre amarillo
  if (truckStatus === 'MAINTENANCE') {
    return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500';
  }
  
  // Si no, usar el estado de salud
  switch (status) {
    case 'DANGER': return 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500';
    case 'WARNING': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500';
    default: return 'border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700';
  }
};
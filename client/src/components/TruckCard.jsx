import { useState } from 'react';
import { getTruckState, getStatusColor } from '../utils/maintenanceLogic';

function TruckCard({ truck, onUpdate }) {
  const health = getTruckState(truck);
  const cardStyle = getStatusColor(health.generalStatus);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newKm, setNewKm] = useState(truck.currentKm);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (newKm <= truck.currentKm) return alert("El kilometraje debe ser mayor al actual");
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/trucks/${truck.id}/km`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ km: newKm })
      });
      
      if (res.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      AVAILABLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      MAINTENANCE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      IN_USE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    };
    
    const labels = {
      AVAILABLE: 'Disponible',
      MAINTENANCE: 'Mantenimiento',
      IN_USE: 'En Uso'
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.AVAILABLE}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className={`rounded-lg border-l-4 ${cardStyle} shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800 border-r border-t border-b border-gray-200 dark:border-slate-700 overflow-hidden`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{truck.plate}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{truck.model} • {truck.year}</p>
          </div>
          {getStatusBadge(truck.status)}
        </div>
        
        {/* Alertas */}
        {(health.generalStatus !== 'OK') && (
          <div className="mb-4 space-y-2">
            {health.oil.status !== 'OK' && (
              <div className={`text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-2 border ${
                health.oil.status === 'DANGER' 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
              }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{health.oil.status === 'DANGER' ? 'Cambio de aceite requerido' : 'Cambio de aceite próximo'}</span>
              </div>
            )}
            {health.rtv.status !== 'OK' && (
              <div className={`text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-2 border ${
                health.rtv.status === 'DANGER' 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
              }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>
                  {health.rtv.status === 'DANGER' 
                    ? 'Revisión técnica vencida' 
                    : `Revisión técnica en ${health.rtv.daysRemaining} días`}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
          {/* Kilometraje */}
          <div className="space-y-3">
            {!isEditing ? (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kilometraje Actual</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {truck.currentKm.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">km</span>
                  </div>
                  <p className={`text-xs mt-1 ${health.oil.kmRemaining < 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                    {health.oil.kmRemaining >= 0 
                      ? `${health.oil.kmRemaining.toLocaleString()} km hasta próximo servicio`
                      : `Excedido por ${Math.abs(health.oil.kmRemaining).toLocaleString()} km`}
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="ml-2 p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  title="Actualizar kilometraje"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg border border-primary-200 dark:border-primary-800">
                <label className="text-xs font-semibold text-primary-900 dark:text-primary-300 mb-2 block">
                  Actualizar Kilometraje
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 border border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                    value={newKm}
                    onChange={(e) => setNewKm(e.target.value)}
                  />
                  <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                  >
                    {loading ? '...' : 'Guardar'}
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setNewKm(truck.currentKm); }}
                    className="px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* RTV */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">Revisión Técnica</span>
              </div>
              <span className={`text-sm font-semibold ${
                health.rtv.status === 'DANGER' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {new Date(truck.nextRtvDate).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TruckCard;
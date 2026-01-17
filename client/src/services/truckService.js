// Servicio centralizado para operaciones con trucks
import { API_URL } from '../config/api.config';

export const truckService = {
  // Obtener todos los camiones
  async getAll() {
    const response = await fetch(`${API_URL}/trucks`);
    if (!response.ok) throw new Error('Error al obtener camiones');
    return response.json();
  },

  // Crear un nuevo camión
  async create(truckData) {
    const response = await fetch(`${API_URL}/trucks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(truckData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear camión');
    }
    return response.json();
  },

  // Actualizar kilometraje
  async updateKilometers(id, km) {
    const response = await fetch(`${API_URL}/trucks/${id}/km`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ km }),
    });
    if (!response.ok) throw new Error('Error al actualizar kilometraje');
    return response.json();
  },
};

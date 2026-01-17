# 📖 Guía de Uso de la Nueva Estructura

## 🎯 Cómo usar los nuevos servicios

### Opción 1: Imports individuales (actual)
```javascript
import TruckCard from './components/trucks/TruckCard'
import CreateTruckModal from './components/trucks/CreateTruckModal'
```

### Opción 2: Barrel imports (recomendado)
```javascript
import { TruckCard, CreateTruckModal } from './components/trucks'
import { Navbar, Footer } from './components/layout'
```

## 💡 Ejemplos de Uso Futuro

### 1. Usando el servicio de trucks

**Antes (en componentes):**
```javascript
const response = await fetch(`${API_URL}/trucks`);
const data = await response.json();
```

**Ahora (usando servicio):**
```javascript
import { truckService } from '../services/truckService';

const trucks = await truckService.getAll();
```

### 2. Creando un custom hook

**Archivo: `hooks/useTrucks.js`**
```javascript
import { useState, useEffect } from 'react';
import { truckService } from '../services/truckService';

export function useTrucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const data = await truckService.getAll();
      setTrucks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  return { trucks, loading, refetch: fetchTrucks };
}
```

**Uso en componente:**
```javascript
import { useTrucks } from '../hooks/useTrucks';

function App() {
  const { trucks, loading, refetch } = useTrucks();
  
  // ¡Mucho más limpio!
}
```

### 3. Agregando nuevo módulo (Drivers)

```
1. Crear componentes
components/drivers/
├── DriverCard.jsx
├── CreateDriverModal.jsx
└── index.js

2. Crear servicio
services/driverService.js

3. Crear hook
hooks/useDrivers.js

4. Agregar rutas en backend
server/src/routes/driverRoutes.js
server/src/controllers/driverController.js
server/src/services/driverService.js
```

## 🔧 Configuración

### Constantes del proyecto
```javascript
// config/constants.js
export const MAINTENANCE_CONFIG = {
  OIL_CHANGE_INTERVAL: 15000,
  OIL_WARNING_THRESHOLD: 1000,
};

// Uso:
import { MAINTENANCE_CONFIG } from '../config/constants';
```

### API URLs
```javascript
// config/api.config.js
export const API_URL = isProduction 
  ? 'https://api.production.com'
  : 'http://localhost:3001/api';
```

## 📦 Componentes UI Reutilizables (Futuro)

```javascript
// components/ui/Button.jsx
export function Button({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  };
  
  return (
    <button className={`px-4 py-2 rounded ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}

// Uso:
import { Button } from '../ui/Button';
<Button variant="primary">Guardar</Button>
```

## 🎨 Mejores Prácticas

### 1. Mantén los componentes enfocados
```javascript
// ✅ BIEN: Componente con una responsabilidad
function TruckCard({ truck }) {
  return <div>...</div>
}

// ❌ MAL: Componente que hace muchas cosas
function TruckCardWithModalAndForm() { ... }
```

### 2. Usa servicios para llamadas API
```javascript
// ✅ BIEN: Servicio centralizado
truckService.create(data);

// ❌ MAL: Fetch directo en componente
fetch('/api/trucks', { method: 'POST', ... });
```

### 3. Extrae lógica a custom hooks
```javascript
// ✅ BIEN: Lógica reutilizable
const { trucks, loading } = useTrucks();

// ❌ MAL: Lógica repetida en cada componente
const [trucks, setTrucks] = useState([]);
useEffect(() => { ... }, []);
```

### 4. Usa constantes para valores mágicos
```javascript
// ✅ BIEN: Constante nombrada
if (km > MAINTENANCE_CONFIG.OIL_CHANGE_INTERVAL) { ... }

// ❌ MAL: Número mágico
if (km > 15000) { ... }
```

## 🚀 Comando Rápido de Verificación

```bash
# Verificar que no hay errores
cd client && npm run dev

# Debería compilar sin errores y funcionar igual que antes
```

## ✅ Checklist de Migración a Nueva Estructura

- [x] Estructura de carpetas creada
- [x] Archivos movidos correctamente
- [x] Imports actualizados
- [x] Sin errores de compilación
- [ ] Migrar fetch a servicios (opcional)
- [ ] Crear custom hooks (opcional)
- [ ] Agregar componentes UI reutilizables (opcional)
- [ ] Agregar tests por módulo (futuro)

---

**¡Listo para seguir desarrollando! 🎉**

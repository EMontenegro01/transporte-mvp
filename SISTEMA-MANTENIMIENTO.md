# Sistema de Mantenimiento - TransportLog

## 📋 Resumen de Cambios

Se implementó un **sistema completo de gestión de mantenimientos** que permite:
- ✅ Registrar cuando se completan mantenimientos (aceite y RTV)
- ✅ Recalcular automáticamente el próximo mantenimiento
- ✅ Marcar camiones como "en mantenimiento"
- ✅ Vista separada para camiones en mantenimiento vs. operativos

---

## 🔧 Cambios Técnicos

### 1. Base de Datos (Schema Prisma)

**Nuevos campos en el modelo `Truck`:**

```prisma
model Truck {
  // ... campos existentes
  lastOilChangeKm Int      @default(0)      // ✨ Km del último cambio de aceite
  nextOilChangeKm Int      @default(15000)  // ✨ NUEVO: Km del próximo cambio
  lastRtvDate     DateTime?                 // ✨ NUEVO: Fecha del último RTV
  nextRtvDate     DateTime                  // Fecha del próximo RTV
  status          TruckStatus @default(AVAILABLE) // AVAILABLE, MAINTENANCE, ON_TRIP
}
```

### 2. Backend (Nuevas Rutas API)

**Endpoints agregados:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `PATCH` | `/api/trucks/:id/oil-change` | Registra cambio de aceite completado |
| `PATCH` | `/api/trucks/:id/rtv` | Actualiza la fecha de la próxima RTV |
| `PATCH` | `/api/trucks/:id/maintenance` | Envía camión a mantenimiento |

**Lógica de cambio de aceite:**
```javascript
// Cuando se completa un cambio de aceite:
lastOilChangeKm = currentKm actual (ej: 20,000 km)
nextOilChangeKm = currentKm + 15,000 (ej: 35,000 km)

// Se registra en historial de Maintenance
```

### 3. Frontend (UI Mejorada)

**TruckCard.jsx - Botones de acción:**
- 🟢 **"Registrar Cambio de Aceite"**: Aparece cuando `kmRemaining <= 0` (DANGER)
- 🔵 **"Actualizar RTV"**: Aparece cuando la RTV está vencida
- 🟡 **"Enviar a Mantenimiento"**: Marca el camión como no operativo

**App.jsx - Vista separada:**
- Sección "Vehículos en Mantenimiento" (si hay camiones con status MAINTENANCE)
- Sección "Flota Operativa" (camiones disponibles)

---

## 🎯 Flujo de Uso

### Escenario: Cambio de Aceite

1. **Camión llega con 20,000 km** (excedió los 15,000 km)
2. El sistema muestra alerta roja: "Cambio de aceite requerido"
3. El operador hace clic en **"Registrar Cambio de Aceite"**
4. El sistema:
   - Registra `lastOilChangeKm = 20,000`
   - Calcula `nextOilChangeKm = 35,000`
   - Guarda en historial de mantenimiento
   - Actualiza estado a `AVAILABLE`

5. Ahora el camión muestra: "Faltan 15,000 km hasta próximo servicio"

### Escenario: Revisión Técnica (RTV)

1. **RTV vencida o próxima a vencer**
2. El sistema muestra alerta amarilla/roja: "Revisión técnica vencida"
3. El operador hace clic en **"Actualizar RTV"**
4. Se abre un modal para ingresar la nueva fecha de RTV
5. El sistema:
   - Guarda `lastRtvDate = fecha anterior`
   - Actualiza `nextRtvDate = nueva fecha`
   - Registra en historial
   - Actualiza estado a `AVAILABLE`

### Escenario: Enviar a Mantenimiento

1. Camión requiere mantenimiento (aceite o RTV)
2. El operador hace clic en **"Enviar a Mantenimiento"**
3. El sistema cambia `status = MAINTENANCE`
4. El camión se mueve a la sección **"Vehículos en Mantenimiento"**
5. Desaparece de la sección "Flota Operativa"

---

## 📊 Cálculo de Mantenimientos

### Aceite
```javascript
kmRemaining = nextOilChangeKm - currentKm

if (kmRemaining <= 0) → DANGER (rojo)
if (kmRemaining <= 1000) → WARNING (amarillo)
if (kmRemaining > 1000) → OK (verde)
```

### RTV
```javascript
daysRemaining = (nextRtvDate - today) en días

if (daysRemaining < 0) → DANGER (vencida)
if (daysRemaining <= 30) → WARNING (próxima)
if (daysRemaining > 30) → OK
```

---

## 🗄️ Historial de Mantenimiento

Cada vez que se completa un mantenimiento, se guarda un registro:

```javascript
{
  date: "2026-01-17",
  type: "OIL_CHANGE" | "RTV",
  kmAtService: 20000,
  notes: "Cambio de aceite realizado a los 20,000 km. Próximo cambio a los 35,000 km.",
  truckId: 1
}
```

---

## 🎨 Estados Visuales

### TruckCard
- **Borde Verde**: Todo OK
- **Borde Amarillo**: Advertencia (mantenimiento próximo)
- **Borde Rojo**: Peligro (mantenimiento requerido)

### Badges de Estado
- 🟢 **Disponible**: `AVAILABLE` - Operativo
- 🟡 **Mantenimiento**: `MAINTENANCE` - Fuera de servicio
- 🔵 **En Uso**: `ON_TRIP` - En viaje (para futuro)

---

## 🔄 Migración de Datos Existentes

La migración automáticamente:
- Agrega `nextOilChangeKm = 15000` a camiones existentes
- Agrega `lastRtvDate = NULL` (se llenará cuando se haga la primera RTV)

**Camiones existentes necesitan:**
1. Actualizar kilometraje actual
2. Hacer clic en "Registrar Cambio de Aceite" para establecer el baseline correcto

---

## 🚀 Próximos Pasos Sugeridos

1. **Historial de mantenimiento visible**: Mostrar tabla de mantenimientos anteriores por camión
2. **Notificaciones**: Email/SMS cuando un camión requiera mantenimiento
3. **Costos**: Agregar costos estimados de mantenimiento
4. **Reportes**: Dashboard con métricas de mantenimientos realizados

---

## 🐛 Testing Recomendado

1. ✅ Crear camión nuevo → Verificar que nextOilChangeKm se calcule
2. ✅ Actualizar km → Verificar que alerta aparezca correctamente
3. ✅ Completar cambio de aceite → Verificar recálculo
4. ✅ Actualizar RTV → Verificar nueva fecha
5. ✅ Enviar a mantenimiento → Verificar cambio de sección
6. ✅ Modo oscuro → Verificar colores de alertas

---

## 📝 Notas Importantes

- **El kilometraje NUNCA se reinicia** - Es acumulativo del vehículo
- **nextOilChangeKm siempre aumenta** - Se suma 15,000 al km actual al completar servicio
- **Los mantenimientos quedan registrados** - Historial completo en BD
- **Status MAINTENANCE** - Indica que el camión NO está operativo

---

**Versión**: 1.1.0  
**Fecha**: 17 de Enero de 2026  
**Desarrollado por**: TransportLog Team

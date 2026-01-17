# TransportLog - Estructura del Proyecto

Sistema empresarial de gestión de flota de vehículos con seguimiento de mantenimiento.

## 📁 Estructura del Cliente (Frontend)

```
client/src/
├── App.jsx                   # Componente principal de la aplicación
├── main.jsx                  # Punto de entrada de React
│
├── assets/                   # Recursos estáticos (imágenes, iconos)
│
├── components/               # Componentes React organizados por función
│   ├── layout/              # Componentes de estructura de página
│   │   ├── Navbar.jsx       # Barra de navegación con modo oscuro
│   │   └── Footer.jsx       # Pie de página corporativo
│   │
│   ├── trucks/              # Componentes específicos de gestión de camiones
│   │   ├── TruckCard.jsx    # Tarjeta de visualización de camión
│   │   └── CreateTruckModal.jsx  # Modal para crear nuevo camión
│   │
│   └── ui/                  # Componentes UI reutilizables (futuro)
│
├── config/                  # Archivos de configuración
│   ├── api.config.js        # URLs de API (producción/desarrollo)
│   └── constants.js         # Constantes del proyecto
│
├── hooks/                   # Custom React Hooks (futuro)
│   └── index.js            # Hook personalizados (useTrucks, useDarkMode, etc.)
│
├── services/               # Servicios para comunicación con API
│   └── truckService.js     # Servicio centralizado para operaciones con trucks
│
├── styles/                 # Estilos globales
│   ├── index.css          # Estilos principales con Tailwind
│   └── App.css            # Estilos específicos de App
│
└── utils/                  # Utilidades y helpers
    └── maintenanceLogic.js # Lógica de cálculos de mantenimiento
```

## 📁 Estructura del Servidor (Backend)

```
server/
├── index.js                # Punto de entrada del servidor Express
│
├── prisma/                 # Configuración de Prisma ORM
│   ├── schema.prisma      # Esquema de base de datos
│   └── migrations/        # Migraciones de BD
│
└── src/
    ├── config/            # Configuraciones del servidor
    │   └── database.js    # Configuración de Prisma Client
    │
    ├── controllers/       # Controladores de rutas
    │   └── truckController.js  # Lógica de endpoints de trucks
    │
    ├── routes/            # Definición de rutas
    │   └── truckRoutes.js # Rutas de API para trucks
    │
    ├── services/          # Lógica de negocio
    │   └── truckService.js # Servicio de operaciones con trucks
    │
    └── middleware/        # Middlewares personalizados (futuro)
        └── index.js       # Validaciones, autenticación, etc.
```

## 🚀 Ventajas de esta Estructura

### Modularidad
- Cada módulo tiene responsabilidades claras
- Fácil localización de archivos
- Separación de concerns (UI, lógica, datos)

### Escalabilidad
- Preparado para agregar nuevos módulos (conductores, rutas, etc.)
- Estructura consistente para nuevas features
- Servicios reutilizables

### Mantenibilidad
- Imports claros y organizados
- Fácil de entender para nuevos desarrolladores
- Código DRY (Don't Repeat Yourself)

## 🔄 Migraciones Futuras

Para agregar nuevas funcionalidades, sigue estos patrones:

### Nuevo módulo de dominio (ej: Drivers)
```
components/drivers/
  ├── DriverCard.jsx
  ├── CreateDriverModal.jsx
  └── DriverList.jsx

services/
  └── driverService.js
```

### Nuevo hook personalizado
```
hooks/
  ├── useTrucks.js
  ├── useDrivers.js
  └── useDarkMode.js
```

## 📦 Tecnologías

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma ORM
- **Base de datos**: PostgreSQL (Neon)
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🔧 Comandos

### Desarrollo
```bash
# Cliente
cd client && npm run dev

# Servidor
cd server && npm run dev
```

### Producción
```bash
# Cliente
cd client && npm run build

# Servidor
cd server && npm start
```

# 📚 Biblioteca Digital - Conceptos de Ingeniería de Sistemas

Una aplicación web moderna para gestionar y consultar conceptos de Ingeniería de Sistemas, construida con **React**, **TypeScript**, **Node.js** y **Express**.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **React Bootstrap** - Componentes UI

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos relacional
- **TypeORM** - ORM para TypeScript
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas

## 📁 Estructura del Proyecto

```
biblioteca-digital-ingenieria-sistemas/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── types/          # Definiciones de tipos TypeScript
│   │   ├── utils/          # Utilidades y helpers
│   │   └── services/       # Servicios de API
│   ├── public/             # Archivos estáticos
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores de rutas
│   │   ├── models/         # Modelos de base de datos
│   │   ├── routes/         # Definición de rutas
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── types/          # Definiciones de tipos TypeScript
│   │   └── utils/          # Utilidades del servidor
│   └── package.json
├── package.json            # Configuración del workspace
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (versión 12 o superior)

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd biblioteca-digital-ingenieria-sistemas
```

### 2. Instalar dependencias
```bash
# Instalar todas las dependencias (frontend + backend)
npm run install:all

# O instalar por separado:
npm install                    # Dependencias del workspace
cd frontend && npm install     # Dependencias del frontend
cd ../backend && npm install   # Dependencias del backend
```

### 3. Configurar variables de entorno

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Editar el archivo `.env`:
```env
NODE_ENV=development
PORT=5000

# Base de datos PostgreSQL
# URL: jdbc:postgresql://localhost:5432/postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-postgres
DB_NAME=postgres

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Configurar PostgreSQL
```bash
# La aplicación usará la base de datos 'postgres' por defecto
# No es necesario crear una base de datos adicional

# Verificar conexión
psql -U postgres -h localhost -p 5432 -d postgres
```

**Nota**: La aplicación se conectará a la base de datos `postgres` que ya existe por defecto en PostgreSQL. TypeORM creará automáticamente las tablas necesarias.

### 4. Probar conexión a la base de datos
```bash
cd backend
npm run test-db
```

### 5. Inicializar datos de ejemplo
```bash
cd backend
npm run seed
```

### 6. Ejecutar la aplicación

#### Desarrollo (Frontend + Backend)
```bash
npm run dev
```

#### Solo Frontend
```bash
npm run dev:frontend
```

#### Solo Backend
```bash
npm run dev:backend
```

### 7. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 8. Usuario administrador por defecto
- **Email**: admin@biblioteca.com
- **Contraseña**: Admin123!

## 📋 Scripts Disponibles

### Workspace (Raíz)
- `npm run dev` - Ejecuta frontend y backend en modo desarrollo
- `npm run build` - Construye ambas aplicaciones para producción
- `npm run install:all` - Instala todas las dependencias

### Frontend
- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm test` - Ejecuta las pruebas

### Backend
- `npm run dev` - Inicia con nodemon (desarrollo)
- `npm run build` - Compila TypeScript
- `npm start` - Ejecuta la versión compilada
- `npm run test-db` - Prueba la conexión a PostgreSQL
- `npm run seed` - Inicializa datos de ejemplo

## 🔧 Características Principales

### Autenticación
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ JWT tokens
- ✅ Protección de rutas
- ✅ Roles de usuario

### Gestión de Conceptos
- ✅ CRUD completo de conceptos
- ✅ Categorización
- ✅ Búsqueda avanzada
- ✅ Filtros por nivel
- ✅ Recursos multimedia

### UI/UX
- ✅ Diseño responsivo
- ✅ Menú lateral deslizable
- ✅ Formularios con validación
- ✅ Animaciones suaves
- ✅ Colores pasteles

## 🎨 Diseño

La aplicación utiliza una paleta de colores pasteles:
- **Azul cielo**: Para elementos de login
- **Morado lavanda**: Para elementos de registro
- **Gradientes suaves**: Para efectos visuales
- **Bootstrap**: Para componentes base

## 📱 Responsive Design

- **Desktop**: Sidebar fijo + contenido principal
- **Tablet**: Layout adaptativo
- **Móvil**: Menú hamburguesa + offcanvas

## 🔒 Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **JWT**: Autenticación stateless
- **Bcrypt**: Encriptación de contraseñas
- **Validación**: Sanitización de inputs

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Subir la carpeta 'build' a tu plataforma
```

### Backend (Heroku/Railway)
```bash
cd backend
npm run build
# Configurar variables de entorno en la plataforma
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: Biblioteca Digital - Conceptos de Ingeniería de Sistemas
- **Tecnologías**: React, TypeScript, Node.js, Express, MongoDB
- **Versión**: 1.0.0

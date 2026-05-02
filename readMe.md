# File Renamer - Sistema de gestión de documentos

## Descripción

El objetivo de este sistema es permitir a los usuarios subir una plantilla Excel que define rutas y nombres de archivos, y luego asignar archivos reales a cada fila de la plantilla. El sistema normaliza los nombres, calcula SHA256 y genera un ZIP con la estructura solicitada.

---

## Instalación

```bash
mkdir file-renamer
cd file-renamer
mkdir backend frontend
cd backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs multer xlsx archiver fs-extra cors dotenv cookie-parser
npm install --save-dev nodemon

## Arquitectura del proyecto (MVC)

backend/
│
├── .env                          # Variables de entorno
├── .gitignore                    
├── package.json                  
├── server.js                     # Punto de entrada (Express + MongoDB)
│
├── config/                       # Configuración (BD, variables)
│
├── models/                       # Esquemas de MongoDB
│   ├── User.js                   # Usuarios, roles, token activo
│   ├── Template.js               # Plantillas Excel subidas
│   ├── Assignment.js             # Filas del Excel (documentos a renombrar)
│   ├── Audit.js                  # Logs de auditoría
│   └── Setting.js                # Reglas de negocio dinámicas
│
├── controllers/                  # Lógica de los endpoints
│   ├── authController.js         # register, login, logout
│   ├── templateController.js     # CRUD de plantillas
│   ├── assignmentController.js   # Asignación de archivos
│   └── zipController.js          # Generación y descarga de ZIP
│
├── routes/                       # Definición de endpoints
│   ├── authRoutes.js             # POST /register, POST /login, POST /logout
│   ├── templateRoutes.js         # POST /, GET /, GET /:id, DELETE /:id
│   ├── assignmentRoutes.js       # GET /template/:id, POST /upload/:id
│   ├── zipRoutes.js              # POST /generate/:id, GET /download/:id
│   ├── auditRoutes.js            # GET / (solo admin)
│   └── settingRoutes.js          # GET /, PUT / (solo admin)
│
├── middleware/                   # Filtros de Express
│   ├── authMiddleware.js         # Verificar JWT en cookie
│   ├── validations.js            # Validar datos de entrada y sesión
│   └── uploadMiddleware.js       # Configuración de Multer
│
├── utils/                        # Funciones reutilizables
│   ├── authUtils.js              # findUser, comparePassword, updateToken
│   ├── tokenUtils.js             # generateToken, setCookie, clearCookie
│   └── auditUtils.js             # logAudit
│
├── uploads/                      # Archivos subidos (gitignored)
│   ├── templates/                # Excels subidos
│   ├── files/                    # Archivos originales
│   └── output/                   # ZIPs generados
│
└── .env                          # Variables de entorno (no subir a git)

## Modelos de Base de Datos (MongoDB)

### User

- `_id`: String (UUID) - Identificador único
- `email`: String (requerido, único) - Correo del usuario
- `password`: String (requerido, select: false) - Hash de la contraseña
- `name`: String (requerido) - Nombre completo
- `role`: String (requerido) - ADMIN / UPLOADER / DOWNLOADER
- `token`: String (único, sparse, select: false) - Token activo
- `createdAt`: Date - Fecha de registro
- `schemaVersion`: Number (default: 1) - Versión del esquema
- `validFrom`: Date (select: false) - Inicio de vigencia
- `validUntil`: Date (select: false) - Fin de vigencia

---

### Template

- `_id`: String (UUID) - Identificador único
- `uploadedBy`: String (ref: User) - Quién subió el Excel
- `uploadedAt`: Date - Cuándo se subió
- `excelFileName`: String - Nombre original del archivo
- `excelFilePath`: String - Ruta donde está guardado
- `rowCount`: Number - Número de filas del Excel
- `status`: String - ACTIVE / COMPLETED / CANCELLED
- `schemaVersion`: Number (default: 1) - Versión del esquema
- `validFrom`: Date (select: false) - Inicio de vigencia
- `validUntil`: Date (select: false) - Fin de vigencia

---

### Assignment

- `_id`: String (UUID) - Identificador único
- `templateId`: String (ref: Template) - A qué plantilla pertenece
- `rowIndex`: Number - Número de fila (0, 1, 2...)
- `ruta`: String - Carpeta destino (ej: "mascota/mamifero")
- `nombreDeseado`: String - Nombre final deseado
- `status`: String - PENDING / UPLOADED / FAILED
- `originalName`: String - Nombre original del archivo subido
- `normalizedName`: String - Nombre normalizado
- `sha256`: String - Hash SHA256 del archivo
- `filePath`: String - Ruta donde está guardado
- `uploadedAt`: Date - Cuándo se subió
- `schemaVersion`: Number (default: 1) - Versión del esquema
- `validFrom`: Date (select: false) - Inicio de vigencia
- `validUntil`: Date (select: false) - Fin de vigencia

**Índices:** `{ templateId: 1, rowIndex: 1 }` (único)

---

### Audit

- `_id`: String (UUID) - Identificador único
- `userId`: String (ref: User) - Quién hizo la acción
- `action`: String - REGISTER / LOGIN / LOGOUT / UPLOAD_TEMPLATE / UPDATE_TEMPLATE / CANCEL_TEMPLATE / UPLOAD_FILE / GENERATE_ZIP / DOWNLOAD_ZIP / VERIFY_CHECKSUM
- `targetId`: String - ID del recurso afectado
- `ipAddress`: String - Dirección IP del usuario
- `userAgent`: String - Navegador / sistema operativo
- `details`: Mixed - Información adicional
- `timestamp`: Date - Cuándo ocurrió
- `schemaVersion`: Number (default: 1) - Versión del esquema
- `validFrom`: Date (select: false) - Inicio de vigencia
- `validUntil`: Date (select: false) - Fin de vigencia

**Índices:** `{ userId: 1, timestamp: -1 }`, `{ action: 1, timestamp: -1 }`, `{ timestamp: -1 }`

---

### Setting

- `_id`: String (UUID) - Identificador único
- `allowedExtensions`: [String] - Extensiones permitidas (default: ['.pdf', '.jpg', '.png', '.docx'])
- `forbiddenChars`: [String] - Caracteres prohibidos (default: ['<', '>', ':', '"', '|', '?', '*', '\\'])
- `maxFileSizeMB`: Number - Tamaño máximo de archivo (default: 10)
- `maxExcelRows`: Number - Máximo de filas por Excel (default: 1000)
- `normalizeRules`: Object - Reglas de normalización { replaceSpaces, replaceUnderscores, toLowerCase }
- `updatedBy`: String (ref: User) - Quién actualizó
- `schemaVersion`: Number (default: 1) - Versión del esquema
- `validFrom`: Date (select: false) - Inicio de vigencia
- `validUntil`: Date (select: false) - Fin de vigencia

## API Endpoints (Auth)

| Método | Endpoint | Público | Descripción |
|--------|----------|---------|-------------|
| POST | `/auth/register` | ✅ Sí | Registrar nuevo usuario |
| POST | `/auth/login` | ✅ Sí | Iniciar sesión (devuelve cookie) |
| POST | `/auth/logout` | ❌ No | Cerrar sesión (elimina cookie) |

---
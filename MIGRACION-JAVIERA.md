# 🚀 MIGRACIÓN SITIO JAVIERA - profesorajavierapoblete.com

**Fecha**: 2025-10-19  
**Proyecto**: Sitio independiente para Profesora Javiera Poblete  
**Repositorio**: https://github.com/Fconuva/starlight  
**Dominio**: profesorajavierapoblete.com  

---

## 📋 INFORMACIÓN DEL PROYECTO

### Netlify
- **Nombre**: profesorajavierapoblete
- **Site ID**: a45d0aab-9662-4185-8ec9-c3af8c67461a
- **URL**: https://profesorajavierapoblete.netlify.app
- **Dominio Custom**: profesorajavierapoblete.com
- **Repositorio**: github.com/Fconuva/starlight
- **Branch**: main

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node.js**: 22.x
- **Framework**: Astro

### Base de Datos Neon
- **Database**: jolly-cell-99965531
- **Variable**: NETLIFY_DATABASE_URL (pooled)
- **Variable**: NETLIFY_DATABASE_URL_UNPOOLED (direct)

**Connection String (pooled)**:
```
postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

**Connection String (unpooled)**:
```
postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

---

## 📁 ESTRUCTURA DE CARPETAS

### Local
```
C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\
├── profefranciscopancho-blog\     ← Tu sitio principal (NO TOCAR)
└── profesorajavierapoblete\       ← Nuevo sitio de Javiera
    ├── .vscode\
    ├── public\
    │   └── privado\               ← Carpeta para sistema de notas
    ├── src\
    ├── netlify\
    │   └── functions\             ← Funciones serverless
    ├── database\                  ← Schemas SQL
    ├── astro.config.mjs
    ├── package.json
    └── README.md
```

---

## 🎯 PLAN DE MIGRACIÓN

### FASE 1: Preparar Proyecto Base ✅

1. ✅ **Crear carpeta local**
   ```powershell
   cd "C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB"
   New-Item -ItemType Directory -Name "profesorajavierapoblete"
   ```

2. ✅ **Clonar repositorio**
   ```powershell
   cd profesorajavierapoblete
   git clone https://github.com/Fconuva/starlight.git .
   ```

3. **Instalar dependencias**
   ```powershell
   npm install
   npm install @neondatabase/serverless
   ```

### FASE 2: Copiar Sistema de Registro de Notas

**Archivos a copiar desde `profefranciscopancho-blog/privado/`**:

1. **HTML Principal**:
   - `registro-notas.html` → `public/privado/index.html`
   - `dashboard.html` → `public/privado/dashboard.html`
   - `admin-db-docentes.html` → `public/privado/admin-db-docentes.html`

2. **Archivos JSON de Datos**:
   - `objetivos-aprendizaje-lenguaje-NUEVO.json`
   - `curriculo-mineduc.json` (si existe)

3. **CSS**:
   - `css/style.css` (si es necesario para privado)

4. **Netlify Functions**:
   Copiar a `netlify/functions/`:
   - `get-courses.js`
   - `save-courses.js`
   - `delete-course.js`
   - `get-docentes.js` (si existe)
   - `save-docente.js` (si existe)

5. **Database Schemas**:
   Copiar a `database/`:
   - `schema.sql`
   - `init.sql`

### FASE 3: Configurar Base de Datos

1. **Crear tablas en Neon**:
   ```sql
   -- Conectar a la BD usando NETLIFY_DATABASE_URL_UNPOOLED
   -- Ejecutar schema.sql
   ```

2. **Crear usuarios para Javiera**:
   ```sql
   INSERT INTO users (username) VALUES 
   ('javiera'),
   ('docente1'),
   ('docente2'),
   ('docente3');
   ```

### FASE 4: Adaptar Código

1. **Actualizar URLs en HTML**:
   - Cambiar referencias a rutas relativas
   - Verificar que las llamadas a `/api/` funcionen

2. **Configurar Astro** (`astro.config.mjs`):
   ```javascript
   export default defineConfig({
     output: 'static',
     build: {
       format: 'file'
     }
   });
   ```

3. **Configurar `package.json`**:
   ```json
   {
     "scripts": {
       "dev": "astro dev",
       "build": "astro build",
       "preview": "astro preview"
     },
     "dependencies": {
       "@astrojs/tailwind": "^5.0.0",
       "@neondatabase/serverless": "^0.9.0",
       "astro": "^4.0.0"
     }
   }
   ```

### FASE 5: Testing Local

1. **Instalar Netlify CLI**:
   ```powershell
   npm install -g netlify-cli
   ```

2. **Configurar variables de entorno** (`.env`):
   ```env
   NETLIFY_DATABASE_URL=postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   
   NETLIFY_DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   ```

3. **Ejecutar localmente**:
   ```powershell
   netlify dev
   ```

4. **Probar funcionalidad**:
   - Login con `?docente=javiera`
   - Crear curso
   - Agregar estudiantes
   - Agregar tareas
   - Sincronizar con BD

### FASE 6: Deploy a Netlify

1. **Build local**:
   ```powershell
   npm run build
   ```

2. **Commit y push**:
   ```powershell
   git add .
   git commit -m "Migrar sistema de registro de notas"
   git push origin main
   ```

3. **Verificar deploy en Netlify**:
   - https://app.netlify.com/sites/profesorajavierapoblete/deploys
   - Esperar que el estado sea "Published"

4. **Probar en producción**:
   - https://profesorajavierapoblete.com/privado/?docente=javiera

---

## 🔧 CONFIGURACIONES IMPORTANTES

### 1. Autenticación de Docentes

El sistema actual usa parámetro URL `?docente=X`. Opciones para Javiera:

**Opción A**: Mantener sistema actual
- `?docente=javiera` → Username: javiera
- `?docente=docente1` → Username: docente1
- etc.

**Opción B**: Crear login dedicado
- Formulario de login con usuario y contraseña
- Guardar sesión en localStorage
- Más seguro pero requiere más trabajo

**Recomendación**: Empezar con Opción A, migrar a Opción B después.

### 2. Namespace de Datos

Cada docente tiene su propio namespace en localStorage y BD:
- `javiera_allCourses` → Cursos de Javiera
- `docente1_allCourses` → Cursos de Docente1
- etc.

### 3. Variables de Entorno en Netlify

Ya configuradas:
- ✅ `NETLIFY_DATABASE_URL` (pooled)
- ✅ `NETLIFY_DATABASE_URL_UNPOOLED` (direct)

### 4. DNS y Dominios

Ya configurado en Netlify:
- ✅ `profesorajavierapoblete.com` → Primary domain
- ✅ `www.profesorajavierapoblete.com` → Redirect to primary
- ✅ SSL/TLS con Let's Encrypt

---

## 📝 CHECKLIST DE MIGRACIÓN

### Pre-requisitos
- [ ] Node.js 22.x instalado
- [ ] Git configurado
- [ ] Netlify CLI instalado
- [ ] Acceso a repositorio GitHub

### Estructura
- [ ] Carpeta `profesorajavierapoblete` creada
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)

### Archivos Copiados
- [ ] `registro-notas.html` → `public/privado/index.html`
- [ ] `dashboard.html` → `public/privado/dashboard.html`
- [ ] `admin-db-docentes.html` → `public/privado/admin-db-docentes.html`
- [ ] JSON de OAs copiados
- [ ] Netlify Functions copiadas
- [ ] Database schemas copiados

### Configuración
- [ ] `.env` con variables de BD
- [ ] `astro.config.mjs` configurado
- [ ] `package.json` actualizado
- [ ] Rutas en HTML verificadas

### Base de Datos
- [ ] Tablas creadas en Neon
- [ ] Usuario `javiera` creado
- [ ] Permisos verificados

### Testing
- [ ] Build local exitoso (`npm run build`)
- [ ] Netlify dev funciona (`netlify dev`)
- [ ] Login funciona
- [ ] CRUD de cursos funciona
- [ ] CRUD de estudiantes funciona
- [ ] CRUD de tareas funciona
- [ ] Sincronización con BD funciona

### Deploy
- [ ] Código commiteado
- [ ] Push a GitHub
- [ ] Netlify autodeploy exitoso
- [ ] Site accesible en `profesorajavierapoblete.com`
- [ ] Funcionalidad completa en producción

---

## 🚨 DIFERENCIAS CON SITIO PRINCIPAL

| Aspecto | Francisco (Blog) | Javiera (Starlight) |
|---------|------------------|---------------------|
| **Framework** | HTML estático | Astro |
| **Repositorio** | Fconuva/profe-blog | Fconuva/starlight |
| **Carpeta Local** | `profefranciscopancho-blog/` | `profesorajavierapoblete/` |
| **Dominio** | profefranciscopancho-blog.netlify.app | profesorajavierapoblete.com |
| **Base de Datos** | Compartida | **MISMA BD** (Neon) |
| **Contenido** | Blog + Privado | **Solo Privado** |
| **Usuario Principal** | francisco | **javiera** |

---

## ⚠️ ADVERTENCIAS

### 1. Base de Datos Compartida
Ambos sitios usan la **MISMA base de datos Neon**. Los datos están separados por `user_id`, pero comparten las mismas tablas.

**Implicaciones**:
- ✅ Los cambios en el schema afectan ambos sitios
- ✅ Los datos están aislados por `username`
- ⚠️ Si se borra una tabla, afecta ambos sitios

**Solución Recomendada** (futuro):
- Crear una base de datos Neon separada para Javiera
- Actualizar `NETLIFY_DATABASE_URL` en el sitio de Javiera

### 2. Funciones Duplicadas
Las Netlify Functions estarán duplicadas en ambos repositorios.

**Mantenimiento**:
- Si corriges un bug en una función, debes actualizarla en ambos repos
- Considera crear un repo compartido de funciones (avanzado)

### 3. Astro vs HTML Estático
El sitio de Javiera usa Astro, no HTML estático.

**Diferencias**:
- Los archivos `.html` deben estar en `public/` para servirse como estáticos
- Las rutas de Astro usan `.astro` para páginas dinámicas
- El build genera archivos en `dist/`

---

## 🔗 RECURSOS

### Documentación
- [Astro Docs](https://docs.astro.build)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Neon Postgres](https://neon.tech/docs)

### Repositorios
- Blog Francisco: https://github.com/Fconuva/profe-blog
- Sitio Javiera: https://github.com/Fconuva/starlight

### Netlify Dashboards
- Francisco: https://app.netlify.com/sites/profefranciscopancho-blog
- Javiera: https://app.netlify.com/sites/profesorajavierapoblete

---

## 📞 PRÓXIMOS PASOS

1. **Ejecutar FASE 2**: Copiar archivos del sistema de notas
2. **Ejecutar FASE 3**: Configurar base de datos
3. **Ejecutar FASE 4**: Adaptar código para Astro
4. **Ejecutar FASE 5**: Testing local
5. **Ejecutar FASE 6**: Deploy a producción

---

**Estado Actual**: ✅ FASE 1 COMPLETADA  
**Próximo**: Copiar archivos del sistema de registro de notas


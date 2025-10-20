# 🚀 GUÍA RÁPIDA - Sitio Javiera

## ✅ YA HECHO

1. ✅ Carpeta creada: `C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profesorajavierapoblete`
2. ✅ Repositorio clonado desde GitHub: `Fconuva/starlight`
3. ✅ Estructura de carpetas creada (`public/privado`, `netlify/functions`, `database`)
4. ✅ Archivo `registro-notas.html` copiado como `public/privado/index.html`

---

## 📋 PASOS SIGUIENTES (Hazlos TÚ)

### PASO 1: Copiar Archivos Restantes

Abre PowerShell y ejecuta:

```powershell
cd "C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profesorajavierapoblete"

# Copiar archivos HTML
Copy-Item "..\profefranciscopancho-blog\privado\dashboard.html" "public\privado\dashboard.html" -Force
Copy-Item "..\profefranciscopancho-blog\privado\admin-db-docentes.html" "public\privado\admin-db-docentes.html" -Force

# Copiar archivos JSON
Copy-Item "..\profefranciscopancho-blog\privado\objetivos-aprendizaje-lenguaje-NUEVO.json" "public\privado\" -Force
Copy-Item "..\profefranciscopancho-blog\privado\objetivos-aprendizaje-lenguaje.json" "public\privado\" -Force

# Copiar Netlify Functions
Copy-Item "..\profefranciscopancho-blog\netlify\functions\get-courses.js" "netlify\functions\" -Force
Copy-Item "..\profefranciscopancho-blog\netlify\functions\save-courses.js" "netlify\functions\" -Force  
Copy-Item "..\profefranciscopancho-blog\netlify\functions\delete-course.js" "netlify\functions\" -Force

# Copiar Database Schemas
Copy-Item "..\profefranciscopancho-blog\database\schema.sql" "database\" -Force
Copy-Item "..\profefranciscopancho-blog\database\init.sql" "database\" -Force

# Copiar CSS (si existe)
New-Item -ItemType Directory -Path "public\css" -Force
Copy-Item "..\profefranciscopancho-blog\css\*" "public\css\" -Recurse -Force
```

### PASO 2: Instalar Dependencias

```powershell
npm install
npm install @neondatabase/serverless
```

### PASO 3: Crear Archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con:

```env
NETLIFY_DATABASE_URL=postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require

NETLIFY_DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_D87wUIavERYX@ep-young-water-ae6w0wwq.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### PASO 4: Probar Localmente

```powershell
# Opción A: Con Netlify Dev (recomendado)
npm install -g netlify-cli
netlify dev

# Opción B: Con Astro
npm run dev
```

Luego abre: `http://localhost:8888/privado/?docente=javiera`

### PASO 5: Deploy a Netlify

```powershell
git add .
git commit -m "Migrar sistema de registro de notas de Francisco"
git push origin main
```

Netlify detectará automáticamente el push y hará el deploy.

### PASO 6: Verificar en Producción

1. Espera 2-3 minutos para que Netlify complete el deploy
2. Ve a: https://app.netlify.com/sites/profesorajavierapoblete/deploys
3. Verifica que el deploy esté "Published" (verde)
4. Abre: https://profesorajavierapoblete.com/privado/?docente=javiera

---

## 🔑 USUARIOS PARA JAVIERA

Después del deploy, puedes acceder con:

- **Javiera**: `?docente=javiera` (usuario principal)
- **Docente 1**: `?docente=docente1`
- **Docente 2**: `?docente=docente2`
- **Docente 3**: `?docente=docente3`
- **Docente 4**: `?docente=docente4`

Cada uno tendrá su propio espacio de datos separado.

---

## ⚙️ CONFIGURACIÓN DE NETLIFY

Ya está configurado en Netlify:

✅ **Build Settings**:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

✅ **Variables de Entorno**:
- `NETLIFY_DATABASE_URL` (pooled)
- `NETLIFY_DATABASE_URL_UNPOOLED` (direct)

✅ **Dominio**:
- `profesorajavierapoblete.com` (primary)
- `www.profesorajavierapoblete.com` (redirect)

✅ **SSL/TLS**:
- Let's Encrypt habilitado

---

## 🗄️ BASE DE DATOS

**IMPORTANTE**: Comparte la misma base de datos Neon que el sitio de Francisco.

Los datos están **separados** por `username`:
- Francisco: `username = 'francisco'`
- Javiera: `username = 'javiera'`
- etc.

**Tablas que se usan**:
- `users` - Usuarios del sistema
- `courses` - Cursos (con `user_id` para separar)
- Otras tablas según el schema

---

## 🐛 PROBLEMAS COMUNES

### "Cannot find module @neondatabase/serverless"
```powershell
npm install @neondatabase/serverless
```

### "Netlify function not found"
- Verifica que las funciones estén en `netlify/functions/`
- Verifica que tengan el formato correcto de export

### "Database connection error"
- Verifica que las variables de entorno estén en `.env`
- Verifica que Netlify tenga las variables configuradas

### "404 Not Found en /privado/"
- Astro requiere que los archivos HTML estáticos estén en `public/`
- Verifica que `public/privado/index.html` exista

---

## 📁 ESTRUCTURA FINAL

```
profesorajavierapoblete/
├── .vscode/
├── public/
│   ├── privado/
│   │   ├── index.html (registro-notas.html)
│   │   ├── dashboard.html
│   │   ├── admin-db-docentes.html
│   │   ├── objetivos-aprendizaje-lenguaje-NUEVO.json
│   │   └── objetivos-aprendizaje-lenguaje.json
│   └── css/
│       └── style.css
├── src/
├── netlify/
│   └── functions/
│       ├── get-courses.js
│       ├── save-courses.js
│       └── delete-course.js
├── database/
│   ├── schema.sql
│   └── init.sql
├── .env
├── .gitignore
├── astro.config.mjs
├── package.json
├── README.md
├── MIGRACION-JAVIERA.md (guía completa)
└── GUIA-RAPIDA.md (este archivo)
```

---

## ✅ CHECKLIST

- [ ] Archivos HTML copiados
- [ ] Archivos JSON copiados
- [ ] Netlify Functions copiadas
- [ ] Database schemas copiados
- [ ] CSS copiado
- [ ] `.env` creado
- [ ] `npm install` ejecutado
- [ ] Probado localmente
- [ ] Git commit + push
- [ ] Deploy exitoso en Netlify
- [ ] Probado en producción

---

## 📞 AYUDA

Si tienes problemas, revisa:

1. **MIGRACION-JAVIERA.md** - Guía técnica completa
2. **Netlify Logs**: https://app.netlify.com/sites/profesorajavierapoblete/deploys
3. **Neon Console**: https://console.neon.tech

---

**¡Suerte con la migración! 🚀**

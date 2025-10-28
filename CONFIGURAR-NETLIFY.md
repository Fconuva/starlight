# 🔐 Variables de Entorno para Netlify

## Variables que debes agregar en Netlify

Ve a: **Site settings → Environment variables → Add a variable**

Agrega estas 8 variables con sus valores exactos:

### 1. FIREBASE_API_KEY
```
AIzaSyDIx3ZOf7ZYRDzVXsEijispVJ4VRHt-qPw
```

### 2. FIREBASE_AUTH_DOMAIN
```
profejavi-f48e1.firebaseapp.com
```

### 3. FIREBASE_DATABASE_URL
```
https://profejavi-f48e1-default-rtdb.firebaseio.com
```

### 4. FIREBASE_PROJECT_ID
```
profejavi-f48e1
```

### 5. FIREBASE_STORAGE_BUCKET
```
profejavi-f48e1.firebasestorage.app
```

### 6. FIREBASE_MESSAGING_SENDER_ID
```
787979084401
```

### 7. FIREBASE_APP_ID
```
1:787979084401:web:1e022ba8df2b21a4fa31d0
```

### 8. GEMINI_API_KEY
```
[TU API KEY DE GOOGLE GEMINI AQUÍ]
```

---

## 📋 Paso a Paso en Netlify

1. **Abre tu sitio en Netlify**: https://app.netlify.com
2. **Haz clic en tu sitio**: "profesorajavierapoblete"
3. **Ve a**: Site settings (en el menú superior)
4. **En el menú lateral**: Build & deploy → Environment
5. **Haz clic en**: "Add a variable" o "Add variables"
6. **Para cada variable**:
   - **Key**: Copia el nombre (ej: `FIREBASE_API_KEY`)
   - **Value**: Copia el valor exacto (ej: `AIzaSyDIx3ZOf7ZYRDzVXsEijispVJ4VRHt-qPw`)
   - **Scope**: Deja "All deploy contexts" o "Production"
   - Haz clic en "Create variable"
7. **Repite** para las 8 variables
8. **Trigger deploy**: 
   - Ve a "Deploys" (en el menú superior)
   - Haz clic en "Trigger deploy" → "Deploy site"

---

## ✅ Una vez configurado

El sitio se desplegará automáticamente y:
- ✅ No habrá errores de "exposed secrets"
- ✅ Firebase funcionará correctamente
- ✅ Los reportes con IA funcionarán
- ✅ Todo estará protegido en el servidor

---

## 🔍 Verificar que funcionó

Después del despliegue:
1. Abre tu sitio: https://profesorajavierapoblete.com
2. Ve a la planilla
3. Prueba generar un reporte con IA
4. Si funciona, ¡todo está listo! 🎉

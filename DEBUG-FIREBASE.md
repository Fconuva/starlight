# 🔍 Debug Firebase - Guía de Verificación

## ✅ Cambios Implementados

1. **Logs detallados** en consola del navegador para rastrear:
   - Inicialización de Firebase
   - Guardado de datos
   - Lectura de datos
   - Estado de conexión

2. **Mensajes de error mejorados** con información específica

## 🧪 Cómo Verificar que Firebase Funciona

### Paso 1: Abrir Consola del Navegador
- Chrome/Edge: `F12` o `Ctrl+Shift+I`
- Ver pestaña "Console"

### Paso 2: Al Cargar la Página Verás:
```
👤 Docente actual: 1
🔄 Cargando configuración de Firebase...
📋 Config recibida (databaseURL): https://profejavi-f48e1-default-rtdb.firebaseio.com
✅ Firebase inicializado correctamente
✅ Firebase conectado exitosamente
🔥 FirebaseDB inicializado para docente 1
📖 Leyendo de Firebase: courses/1/courses
```

### Paso 3: Al Agregar un Curso Verás:
```
💾 Intentando guardar curso: {name: "...", letter: "A", ...}
✅ Guardado en Firebase: courses/1/courses/-AbC123...
✅ Curso guardado con ID: -AbC123...
📖 Leyendo de Firebase: courses/1/courses
✅ Datos encontrados en courses: [...]
```

### Paso 4: Al Recargar la Página
Los datos DEBEN permanecer. Si ves:
```
⚠️ No hay datos en courses
```
Significa que Firebase no está guardando.

## 🔥 Verificar en Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: `profejavi-f48e1`
3. Ve a **Realtime Database** en el menú izquierdo
4. Deberías ver la estructura:
   ```
   courses/
     1/  (docente 1)
       courses/
         -AbC123.../
           name: "Lengua y Literatura 2° HC A"
           letter: "A"
           ...
   ```

## ⚠️ Si los Datos NO se Guardan

### Verificar Reglas de Firebase
En Firebase Console → Realtime Database → Rules, deben estar:
```json
{
  "rules": {
    "courses": {
      "$username": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

### Verificar Variables de Entorno en Netlify
En Netlify Dashboard → Site settings → Environment variables:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_DATABASE_URL` ← **MUY IMPORTANTE**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## 📝 Errores Comunes

### Error: "Permission denied"
- Las reglas de Firebase están mal configuradas
- Solución: Actualizar reglas en Firebase Console

### Error: "Cannot read properties of null"
- Firebase no se inicializó correctamente
- Verificar que `/.netlify/functions/firebase-config` responde

### Los datos desaparecen al recargar
- Firebase NO está guardando (solo localStorage/sessionStorage)
- Verificar logs en consola del navegador
- Verificar que aparece: `✅ Guardado en Firebase`

## 🎯 Próximos Pasos

1. **Prueba ahora**: Abre el sitio con F12 y revisa la consola
2. **Agrega un curso**: Verifica los logs
3. **Recarga la página**: Los datos deben permanecer
4. **Reporta**: Copia y pega los logs de consola si hay problemas

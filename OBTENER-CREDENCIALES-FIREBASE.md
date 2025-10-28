# 🔑 Cómo Obtener las Credenciales Correctas de Firebase

## ⚠️ IMPORTANTE: Revoca la Service Account Key que compartiste

1. Ve a: https://console.firebase.google.com/project/profejavi-f48e1/settings/serviceaccounts/adminsdk
2. Busca la clave con ID: `735e79e789cb4ecdf5d1ad94f74ed06d145b346e`
3. Haz clic en el menú (⋮) y selecciona "Eliminar clave"
4. Confirma la eliminación

**Razón**: La private key que compartiste es una credencial de administrador que da acceso total a tu proyecto Firebase. Nunca debe ser expuesta públicamente.

---

## ✅ Obtener las Credenciales Correctas (Web App Config)

### Paso 1: Ve a la Configuración del Proyecto
1. Abre: https://console.firebase.google.com/project/profejavi-f48e1/settings/general
2. Baja hasta la sección **"Tus aplicaciones"**

### Paso 2: Agrega una App Web (si no existe)
Si ves una aplicación web existente:
- Haz clic en ella para ver la configuración

Si NO hay ninguna aplicación web:
1. Haz clic en el ícono `</>`  (Web)
2. Dale un nombre (ej: "Planilla Web")
3. NO marques "Firebase Hosting"
4. Haz clic en "Registrar app"

### Paso 3: Copia la Configuración
Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "profejavi-f48e1.firebaseapp.com",
  databaseURL: "https://profejavi-f48e1-default-rtdb.firebaseio.com",
  projectId: "profejavi-f48e1",
  storageBucket: "profejavi-f48e1.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**ESTOS** son los valores que necesitas para Netlify.

---

## 🤖 API Key de Google Gemini

Ya tienes la API key de Google Gemini. Guárdala para el siguiente paso.

---

## 📋 Valores para Netlify

Una vez que tengas la configuración web de Firebase, agrega estas variables en Netlify:

| Variable | Ejemplo de Valor |
|----------|------------------|
| `FIREBASE_API_KEY` | AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX |
| `FIREBASE_AUTH_DOMAIN` | profejavi-f48e1.firebaseapp.com |
| `FIREBASE_DATABASE_URL` | https://profejavi-f48e1-default-rtdb.firebaseio.com |
| `FIREBASE_PROJECT_ID` | profejavi-f48e1 |
| `FIREBASE_STORAGE_BUCKET` | profejavi-f48e1.appspot.com |
| `FIREBASE_MESSAGING_SENDER_ID` | 123456789012 |
| `FIREBASE_APP_ID` | 1:123456789012:web:abcdef123456 |
| `GEMINI_API_KEY` | Tu API key de Google Gemini |

---

## 🚀 Siguiente Paso

Una vez que tengas la configuración correcta de Firebase:
1. Avísame y te ayudo a agregarlas en Netlify
2. O sigue las instrucciones en Netlify para agregar cada variable

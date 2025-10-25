# Configuración de API Keys

## Google Gemini API Key

Para usar las funciones de IA generativa, necesitas configurar tu propia API key de Google Gemini.

### Obtener una API key:

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### Configurar en la aplicación:

Los usuarios pueden configurar su API key directamente desde la interfaz:

1. Accede al sistema de notas
2. Ve a la sección de Configuración de IA
3. Ingresa tu API key de Gemini
4. Haz clic en "Guardar"

La API key se guardará de forma local en el navegador del usuario.

### Alternativa: API key predeterminada

Si deseas configurar una API key predeterminada para todos los usuarios:

1. Edita `public/privado/registro-notas.html`
2. Busca la línea: `const DEFAULT_GEMINI_API_KEY = '';`
3. Reemplaza con: `const DEFAULT_GEMINI_API_KEY = 'TU_API_KEY_AQUI';`
4. Haz lo mismo en `public/privado/index.html`

**IMPORTANTE:** No subas archivos con API keys al repositorio público de GitHub.

## Seguridad

- Las API keys nunca deben subirse a repositorios públicos
- Cada usuario debe configurar su propia API key
- Las keys se almacenan localmente en el navegador (localStorage)
- Netlify escanea automáticamente en busca de secrets y bloqueará el deploy si los detecta

## Notas

- La funcionalidad de IA es opcional
- El sistema funciona sin API key, solo que sin las funciones de IA generativa
- Los usuarios pueden actualizar su API key en cualquier momento

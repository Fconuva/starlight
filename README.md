#  Plataforma Educativa - Profesora Javiera Poblete

Una plataforma web moderna para la gestión educativa, evaluación de estudiantes y generación de reportes pedagógicos con IA.

##  Características Principales

###  Evaluación y Reportes
- **Planilla Interactiva**: Interfaz moderna para evaluación de estudiantes con diseño profesional
- **Reportes Individuales con IA**: Análisis pedagógico personalizado usando Google Gemini 2.5
- **Reportes Grupales**: Visualización de datos colectivos para toma de decisiones docente
- **Gráficos y Métricas**: Visualización de datos con Chart.js
- **Descarga PDF**: Exportación de reportes en formato PDF

###  Base de Datos en la Nube
- **Firebase Realtime Database**: Almacenamiento en la nube con respaldo automático
- **Migración Automática**: Transferencia transparente desde almacenamiento local
- **Acceso Multi-dispositivo**: Sincronización entre diferentes dispositivos
- **Seguridad**: Reglas de acceso aisladas por docente

###  Inteligencia Artificial
- **Análisis Pedagógico**: Evaluación constructiva con enfoque formativo
- **Objetivos de Aprendizaje**: Integración con marco OA del MINEDUC
- **Retroalimentación Personalizada**: Sugerencias específicas por estudiante

##  Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Base de Datos**: Firebase Realtime Database
- **IA**: Google Gemini 2.5 API
- **Visualización**: Chart.js
- **Exportación**: jsPDF, html2canvas
- **Hosting**: Netlify
- **Control de Versiones**: Git

##  Estructura del Proyecto

`
profesorajavierapoblete/
 public/                          # Archivos estáticos
    privado/                     # Páginas privadas
       planilla.html           # Planilla principal
       firebase-config.js      # Configuración Firebase
       ...                     # Otras páginas
    css/                        # Estilos CSS
 netlify/
    functions/                  # Funciones serverless
 src/                            # Código fuente Astro
 database/
    schema.sql                  # Esquema base de datos
 astro.config.mjs               # Configuración Astro
 package.json                   # Dependencias
 netlify.toml                   # Configuración Netlify
`

##  Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Cuenta Firebase
- API Key de Google Gemini

### Configuración Inicial

1. **Clona el repositorio**:
   `ash
   git clone <url-del-repositorio>
   cd profesorajavierapoblete
   `

2. **Instala dependencias**:
   `ash
   npm install
   `

3. **Configura Firebase**:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Realtime Database
   - Copia las credenciales del proyecto

4. **Variables de entorno**:
   Crea un archivo .env basado en .env.example:
   `env
   FIREBASE_API_KEY=tu_api_key
   FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com/
   FIREBASE_PROJECT_ID=tu_proyecto
   FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef123456
   GEMINI_API_KEY=tu_gemini_api_key
   `

5. **Actualiza reglas de Firebase**:
   - Ve a Firebase Console  Realtime Database  Reglas
   - Reemplaza con el contenido de irebase-rules.json

### Despliegue Local

`ash
npm run dev
`

### Despliegue en Producción

El proyecto se despliega automáticamente en Netlify al hacer push a la rama principal.

##  Funcionalidades

### Planilla de Evaluación
- Interfaz intuitiva para registro de evaluaciones
- Validación en tiempo real
- Almacenamiento automático en Firebase

### Reportes con IA
- **Individual**: Análisis personalizado por estudiante
- **Grupal**: Métricas colectivas y tendencias
- **Pedagógico**: Enfoque en aprendizaje y mejora

### Visualización de Datos
- Gráficos de rendimiento por estudiante
- Métricas de objetivos de aprendizaje
- Tendencias temporales

##  Seguridad

- Autenticación por docente
- Aislamiento de datos por usuario
- Reglas de seguridad en Firebase
- Variables de entorno para credenciales

##  Estado del Proyecto

###  Completado
- Interfaz moderna y responsiva
- Integración con Firebase
- Reportes con IA pedagógica
- Exportación PDF
- Migración automática de datos
- Configuración de despliegue

###  Próximos Pasos
- Actualización manual de reglas Firebase en consola
- Verificación de despliegue en producción

##  Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
3. Commit tus cambios (git commit -am 'Agrega nueva funcionalidad')
4. Push a la rama (git push origin feature/nueva-funcionalidad)
5. Abre un Pull Request

##  Licencia

Este proyecto está bajo la Licencia MIT.

##  Contacto

Profesora Javiera Poblete
- Sitio web: [profesorajavierapoblete.com](https://profesorajavierapoblete.com)
- Email: contacto@profesorajavierapoblete.com

---

 Si este proyecto te resulta útil, ¡dale una estrella!

 SITIO DE JAVIERA - CONFIGURACIÓN COMPLETA
=============================================

 DOMINIO: https://profesorajavierapoblete.com
 URL PRINCIPAL: https://profesorajavierapoblete.com/privado/?docente=javiera

 ARCHIVOS MIGRADOS:
-  public/privado/index.html (registro-notas.html)
-  public/privado/dashboard.html
-  public/privado/admin-db-docentes.html
-  public/privado/objetivos-aprendizaje-lenguaje-NUEVO.json (con 2° Medio)
-  public/css/ (carpeta completa)

 FUNCIONES NETLIFY:
-  netlify/functions/get-courses.js
-  netlify/functions/save-courses.js
-  netlify/functions/delete-course.js

 BASE DE DATOS:
-  database/schema.sql
-  .env configurado con credenciales de Neon
-  Base de datos compartida: jolly-cell-99965531
-  Datos aislados por username (javiera)

 DEPENDENCIAS:
-  npm install completado (367 paquetes)
-  @neondatabase/serverless instalado

 DEPLOY:
-  Git configurado
-  Commit realizado
-  Push a GitHub exitoso (commit 4450f96)
-  Netlify detectará el push y desplegará automáticamente

 PRÓXIMOS PASOS:
1. Espera 2-3 minutos a que Netlify termine el deploy
2. Ve a: https://app.netlify.com/sites/profesorajavierapoblete/deploys
3. Verifica que el estado sea "Published"
4. Abre: https://profesorajavierapoblete.com/privado/?docente=javiera
5. Prueba:
   - Login como Javiera
   - Crear un curso
   - Agregar estudiantes
   - Crear una tarea (prueba 2° Medio)
   - Verificar que se sincronice a la base de datos

 CREDENCIALES DE PRUEBA:
- URL: /privado/?docente=javiera
- Username: javiera
- Los datos estarán completamente separados de Francisco

 CARACTERÍSTICAS DISPONIBLES:
-  Sistema de cursos y notas
-  Gestión de estudiantes
-  Creación de tareas con OAs
-  2° Medio, 3° Medio y 4° Medio
-  Retroalimentación con IA
-  Sincronización automática con base de datos
-  Aislamiento de datos por docente

Fecha de migración: 19-10-2025 21:10

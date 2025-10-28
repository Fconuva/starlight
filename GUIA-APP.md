# Sistema de Evaluación - Versión 2025

## ✨ Características Principales

✅ **Gestión de Cursos**
- Crear, editar y eliminar cursos
- Información: Nombre, Asignatura, Período
- Datos guardados automáticamente

✅ **Gestión de Estudiantes**  
- Agregar estudiantes por curso
- Información: Nombre, Apellido, Email
- Eliminación de estudiantes

✅ **Gestión de Tareas**
- Crear tareas por curso
- Tipos: Formativa, Sumativa, Diagnóstica
- Calificaciones máximas personalizables

✅ **Registro de Calificaciones**
- Interfaz visual para ingresar notas
- Validación automática de rangos
- Guardado inmediato

✅ **Reportes**
- Reporte de curso con promedios
- Estadísticas por estudiante
- Exportación disponible

## 🚀 Cómo Usar

### 1. Acceder a la Aplicación
```
https://profesorajavierapoblete-h6hukxjek-fconuvas-projects.vercel.app/privado/app.html
```

### 2. Crear un Curso
1. Ve a **Cursos** en el menú lateral
2. Haz clic en **Nuevo Curso**
3. Completa: Nombre, Asignatura, Período
4. Haz clic en **Guardar Curso**

### 3. Agregar Estudiantes
1. Ve a **Estudiantes**
2. Selecciona el curso en el dropdown
3. Haz clic en **Nuevo Estudiante**
4. Completa: Nombre, Apellido, Email
5. Haz clic en **Guardar Estudiante**

### 4. Crear Tareas
1. Ve a **Tareas**
2. Selecciona el curso
3. Haz clic en **Nueva Tarea**
4. Completa: Nombre, Fecha, Tipo, Calificación Máxima
5. Haz clic en **Guardar Tarea**

### 5. Ingresar Calificaciones
1. Ve a **Calificaciones**
2. Selecciona el curso
3. Verás una tabla con estudiantes (filas) y tareas (columnas)
4. Ingresa las notas directamente
5. Se guardan automáticamente

### 6. Generar Reportes
1. Ve a **Reportes**
2. Selecciona el curso
3. Haz clic en **Reporte de Curso** para ver resumen
4. Las notas se promedian automáticamente

## 💾 Almacenamiento de Datos

**Local (Navegador):**
- Todos los datos se guardan en IndexedDB
- Persisten aunque cierres el navegador
- No se pierden datos

**Nota:** Actualmente los datos están locales. Para sincronizar con servidor, contacta al administrador.

## 🔧 Características Técnicas

- **Framework:** HTML5 + JavaScript Vanilla
- **Base de Datos:** IndexedDB (almacenamiento local)
- **Responsivo:** Funciona en desktop y móvil
- **Sin dependencias externas:** Funciona offline

## 📞 Soporte

Si encuentras problemas:
1. Limpia la caché del navegador (Ctrl+Shift+Delete)
2. Recarga la página (Ctrl+F5)
3. Prueba en otro navegador
4. Contacta al administrador

## 🔐 Privacidad

- Los datos se almacenan SOLO en tu navegador
- No se envían a servidores (versión local)
- Puedes exportar/descargar tus datos
- Limpia IndexedDB si deseas borrar datos

---

**Versión:** 1.0.0  
**Última actualización:** 28 de Octubre, 2025  
**Estado:** ✅ Funcional y Estable

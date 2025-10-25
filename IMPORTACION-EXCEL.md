# 📊 Importación desde Excel del Colegio

## ✅ Nueva Funcionalidad Implementada

Se ha creado un nuevo sistema de importación que permite cargar cursos completos desde los archivos Excel oficiales del colegio.

## 🎯 Características

### Datos que se importan automáticamente:
- ✅ **Número de lista** (Nº de Orden)
- ✅ **Número de matrícula** (Nº de Matr.)
- ✅ **Nombre completo del estudiante**
- ✅ **RUN** (con guión y dígito verificador)
- ✅ **Fecha de nacimiento**
- ✅ **Fecha de ingreso** (opcional)
- ✅ **Fecha de retiro** (opcional - marca al estudiante como retirado)

### Detección automática:
- 🔍 **Nombre del curso**: Se extrae del encabezado del Excel (ej: "2° AÑO B EGB 2024")
- 🔍 **Año/Período**: Se detecta automáticamente del formato del archivo
- 🔍 **Separación de nombres**: El sistema divide automáticamente apellidos y nombres

## 📁 Formato del archivo Excel

El archivo debe tener estas columnas (en cualquier orden):

```
| Nº de Orden | Nº de Matr. | FECHA (Ingreso/Retiro) | NOMBRE COMPLETO | RUN | FECHA NACIMIENTO |
```

### Ejemplo de formato válido:
```
CURSO: 2º AÑO "B" EGB 2024

Nº de Orden | Nº de Matr. | Ingreso | Retiro | NOMBRE COMPLETO                      | RUN          | FECHA NACIMIENTO
1           | 135         |         |        | ABALLAY CALDERÓN VICENTE ALONSO      | 25487936-3   | 25-08-2016
2           | 136         |         |        | AGUILAR VALENZUELA RODRIGO IGNACIO   | 25413166-0   | 14-06-2016
```

## 🚀 Cómo usar

1. **Accede desde el Dashboard**:
   - Ve a "Gestión de Cursos"
   - Haz clic en el botón verde "Importar desde Excel del Colegio"

2. **Selecciona el docente destino**:
   - Prof. Francisco Conuva
   - Prof. Javiera Poblete (u otro configurado)

3. **Completa la información**:
   - Nombre del Curso (se autocompletará si se detecta del Excel)
   - Asignatura (ej: "Lenguaje y Comunicación")
   - Período (ej: "2024", "2025")

4. **Selecciona el archivo Excel** (.xlsx o .xls)

5. **Vista previa**:
   - El sistema mostrará una vista previa con los primeros 10 estudiantes
   - Verifica que los datos se hayan cargado correctamente

6. **Importar**:
   - Haz clic en "Importar Curso desde Excel"
   - El curso se guardará automáticamente en localStorage y en la base de datos

## 💾 Almacenamiento de datos

### Datos visibles en la interfaz:
- Número de lista
- Nombre del estudiante

### Datos almacenados para informes futuros:
- RUN
- Fecha de nacimiento
- Número de matrícula
- Fecha de ingreso
- Fecha de retiro (si aplica)

Todos estos datos quedan guardados en formato JSON dentro de cada estudiante y pueden ser utilizados para:
- Generar informes oficiales
- Exportar nóminas completas
- Crear certificados
- Estadísticas por edad
- Reportes de retiros

## 🔧 Archivos creados/modificados

1. **`public/privado/importar-xlsx.html`** (NUEVO)
   - Interfaz completa para importación desde Excel
   - Parser especializado para el formato del colegio
   - Vista previa de datos
   - Integración con SheetJS

2. **`public/privado/dashboard.html`** (MODIFICADO)
   - Nuevo botón "Importar desde Excel del Colegio"
   - Enrutamiento a la nueva página

3. **`package.json`** (ACTUALIZADO)
   - Dependencia `xlsx` agregada para leer archivos Excel

## 🎨 Diferencias con CSV

| Característica | CSV (Antiguo) | Excel del Colegio (Nuevo) |
|----------------|---------------|---------------------------|
| **Formato** | .csv | .xlsx, .xls |
| **Datos** | Solo nombre y tareas | Nombre + RUN + Fecha nacimiento + Matrícula |
| **Uso** | Importar múltiples cursos con notas | Importar curso vacío con nómina completa |
| **Origen** | Exportado desde el sistema | Archivo oficial del colegio |

## 📋 Próximos pasos sugeridos

- [ ] Crear función para exportar informes con RUN
- [ ] Agregar validación de RUN chileno
- [ ] Crear certificados usando los datos completos
- [ ] Reportes de edad promedio del curso
- [ ] Historial de retiros

## 🐛 Solución de problemas

### El curso no se detecta automáticamente
- Verifica que el Excel tenga el formato: "CURSO: X° AÑO 'Y' ... YYYY"
- Puedes ingresar el nombre manualmente

### No se cargan los estudiantes
- Verifica que exista la columna "NOMBRE COMPLETO"
- Asegúrate que los datos comiencen después de los encabezados

### Datos faltantes
- Los campos opcionales (matrícula, RUN) se dejarán en blanco si no existen
- El sistema funcionará igualmente

## 📞 Soporte

Para problemas o mejoras, contacta al administrador del sistema.

---

**Fecha de implementación**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ Operativo

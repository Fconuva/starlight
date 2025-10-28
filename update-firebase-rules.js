const fs = require('fs');
const path = require('path');

// Read the updated Firebase rules
const rulesPath = path.join(__dirname, 'firebase-rules.json');
const rules = fs.readFileSync(rulesPath, 'utf8');

console.log('📋 Reglas de Firebase actualizadas:');
console.log('========================================');
console.log(rules);
console.log('========================================');
console.log('');
console.log('✅ INSTRUCCIONES PARA ACTUALIZAR FIREBASE:');
console.log('');
console.log('1. Ve a la consola de Firebase: https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto: "profejavi-f48e1"');
console.log('3. Ve a "Realtime Database" en el menú lateral');
console.log('4. Haz clic en "Reglas" en la parte superior');
console.log('5. Reemplaza las reglas existentes con el contenido de arriba');
console.log('6. Haz clic en "Publicar"');
console.log('');
console.log('⚠️  IMPORTANTE: Las nuevas reglas incluyen:');
console.log('   - courses: Para almacenar información de cursos');
console.log('   - students: Para estudiantes de cada docente');
console.log('   - tasks: Para tareas de evaluación');
console.log('   - evaluations: Para calificaciones estudiante-tarea');
console.log('');
console.log('🔒 SEGURIDAD: Solo el docente puede acceder a sus propios datos');
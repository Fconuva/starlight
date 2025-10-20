import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Solo permitir DELETE
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // Leer el body del request
    let body;
    try {
      body = await req.json();
      console.log('📦 Body recibido:', body);
    } catch (e) {
      console.error('❌ Error parseando JSON:', e);
      return new Response(JSON.stringify({
        error: 'Error parseando request body',
        details: e.message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ EXTRAER USERNAME DEL BODY (FIX CRÍTICO)
    const { courseId, username } = body;
    
    if (!courseId) {
      console.error('❌ courseId no proporcionado. Body:', body);
      return new Response(JSON.stringify({
        error: 'Se requiere courseId',
        receivedBody: body
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔍 courseId recibido:', courseId, 'tipo:', typeof courseId);
    
    // ✅ USAR EL USERNAME ENVIADO DESDE EL FRONTEND (en lugar de hardcoded 'fconuva')
    const effectiveUsername = username || 'fconuva';
    console.log(`🗑️ Eliminando curso para username: ${effectiveUsername}`);
    
    // Obtener el user_id del usuario correcto
    let [user] = await sql`
      SELECT id FROM users WHERE username = ${effectiveUsername}
    `;

    if (!user) {
      // Si no existe, crearlo
      [user] = await sql`
        INSERT INTO users (username)
        VALUES (${effectiveUsername})
        RETURNING id
      `;
    }

    // Log para debug
    console.log('Intentando eliminar curso:', { 
      courseId, 
      userId: user.id, 
      username: effectiveUsername 
    });
    
    // Primero buscar el curso para ver si existe
    const existing = await sql`
      SELECT id, course_name FROM courses
      WHERE user_id = ${user.id}
    `;
    
    console.log('Cursos existentes para este usuario:', existing);

    // Eliminar el curso (intentar con diferentes tipos de ID)
    let result;
    try {
      result = await sql`
        DELETE FROM courses
        WHERE id = ${courseId}::bigint AND user_id = ${user.id}
        RETURNING id, course_name
      `;
    } catch (e) {
      console.error('Error con bigint, intentando con int:', e);
      result = await sql`
        DELETE FROM courses
        WHERE id = ${parseInt(courseId)} AND user_id = ${user.id}
        RETURNING id, course_name
      `;
    }

    console.log('Resultado de eliminación:', result);

    if (result.length === 0) {
      return new Response(JSON.stringify({
        error: 'Curso no encontrado',
        courseId: courseId,
        userId: user.id,
        username: effectiveUsername,
        existingCourses: existing.map(c => ({ id: c.id, name: c.course_name }))
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Curso eliminado correctamente para ${effectiveUsername}`,
      deletedCourse: result[0]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en delete-course:', error);
    return new Response(JSON.stringify({
      error: 'Error al eliminar curso',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses/delete"
};

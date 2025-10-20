import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // ✅ FIX: MODO MULTI-DOCENTE - Cada docente ve solo sus cursos
    // Extraer el username del query string
    const url = new URL(req.url);
    const username = url.searchParams.get('username') || 'fconuva'; // Fallback a fconuva
    
    console.log(`📚 Cargando cursos para username: ${username}`);
    
    // Obtener el user_id para este username específico
    let [user] = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    
    // Si no existe el usuario, crearlo
    if (!user) {
      [user] = await sql`
        INSERT INTO users (username)
        VALUES (${username})
        RETURNING id
      `;
      console.log(`👤 Usuario creado: ${username} (id: ${user.id})`);
    }
    
    // Obtener todos los cursos de ESTE usuario específico
    const courses = await sql`
      SELECT 
        id,
        course_name,
        subject,
        period,
        config,
        students,
        tasks,
        created_at,
        updated_at
      FROM courses 
      WHERE user_id = ${user.id}
      ORDER BY updated_at DESC
    `;
    
    // Transformar los datos al formato esperado por el frontend
    const formattedCourses = courses.map(course => ({
      id: Number(course.id),
      courseName: course.course_name,
      subject: course.subject,
      period: course.period,
      config: course.config,
      students: course.students,
      tasks: course.tasks
    }));
    
    console.log(`✅ ${formattedCourses.length} cursos encontrados para ${username}`);
    
    return new Response(JSON.stringify({ 
      success: true,
      courses: formattedCourses 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error en get-courses:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener cursos',
      details: error.message,
      courses: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/courses"
};

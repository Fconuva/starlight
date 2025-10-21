// netlify/functions/check-updates.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const username = event.queryStringParameters?.username;
    
    if (!username) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Username required' })
      };
    }

    const client = await pool.connect();
    
    try {
      // Obtener todos los cursos del usuario con su última modificación
      const result = await client.query(
        `SELECT id, course_name, grade_level, section, subject, year, 
                updated_at, data
         FROM courses 
         WHERE username = $1 
         ORDER BY updated_at DESC`,
        [username]
      );

      const courses = result.rows.map(row => ({
        id: row.id,
        courseName: row.course_name,
        gradeLevel: row.grade_level,
        section: row.section,
        subject: row.subject,
        year: row.year,
        updatedAt: row.updated_at,
        hasChanges: true // Siempre devolver true para forzar sincronización
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          courses,
          timestamp: new Date().toISOString()
        })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking updates:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database error',
        message: error.message
      })
    };
  }
};

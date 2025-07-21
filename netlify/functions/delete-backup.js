/**
 * delete-backup.js - Löscht User Backup aus der Cloud
 * DELETE /.netlify/functions/delete-backup
 */
const { neon } = require('@neondatabase/serverless');

const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL;

const sql = neon(NEON_DATABASE_URL);

const handler = async (event, context) => {
  // CORS headers
  const allowedOrigins = [
    'https://huntersimtest.netlify.app',
    'https://cifi-tools.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = event.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : '*';
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      })
    };
  }

  try {
    // Parse request body
    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required field: userId' 
        })
      };
    }

    // Check if backup exists before deletion
    const existingBackup = await sql`
      SELECT user_id FROM user_backups WHERE user_id = ${userId}
    `;

    if (existingBackup.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No backup found for this user'
        })
      };
    }

    // Delete user backup (history will be cascade deleted due to foreign key)
    const result = await sql`
      DELETE FROM user_backups 
      WHERE user_id = ${userId}
      RETURNING user_id
    `;

    if (result.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Backup not found or already deleted'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          userId: result[0].user_id,
          message: 'Backup successfully deleted'
        }
      })
    };

  } catch (error) {
    console.error('Delete backup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

// Export both for compatibility
exports.handler = handler;
exports.lambdaHandler = handler;

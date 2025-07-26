/**
 * get-backup.js - Lädt User Backup aus der Cloud
 * GET /.netlify/functions/get-backup?userId=xxx
 */
const { neon } = require('@neondatabase/serverless');

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  if (event.httpMethod !== 'GET') {
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
    // Initialize database connection at runtime
    const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;
    
    // Debug: Log available environment variables (mask sensitive data)
    console.log('Environment debug:', {
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: process.env.NETLIFY,
      hasNEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      hasVITE_NEON_DATABASE_URL: !!process.env.VITE_NEON_DATABASE_URL,
      finalDatabaseUrl: !!NEON_DATABASE_URL,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('NEON') || key.includes('DATABASE'))
    });
    
    if (!NEON_DATABASE_URL) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Database configuration error',
          message: 'No database connection string available',
          debug: {
            hasNEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
            hasVITE_NEON_DATABASE_URL: !!process.env.VITE_NEON_DATABASE_URL,
            availableEnvKeys: Object.keys(process.env).filter(key => key.includes('NEON') || key.includes('DATABASE'))
          }
        })
      };
    }
    
    const sql = neon(NEON_DATABASE_URL);

    // Get userId from query parameters
    const { userId } = event.queryStringParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required parameter: userId' 
        })
      };
    }

    // Get user backup from database
    const result = await sql`
      SELECT user_id, backup_code, app_version, created_at, updated_at
      FROM user_backups 
      WHERE user_id = ${userId}
    `;

    console.log('Database query result:', {
      found: result.length > 0,
      backupCodeLength: result[0]?.backup_code?.length,
      backupCodeType: typeof result[0]?.backup_code,
      actualResult: result[0] ? {
        user_id: result[0].user_id,
        backup_code_preview: result[0].backup_code?.substring(0, 50) + '...',
        app_version: result[0].app_version,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at
      } : null
    });

    if (result.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No backup found for this user'
        })
      };
    }

    const backup = result[0];

    // Validate backup code format before sending
    try {
      const decoded = atob(backup.backup_code);
      const backupData = JSON.parse(decoded);
      if (!backupData || backupData.type !== 'hunter-simulator-backup') {
        throw new Error('Corrupted backup data');
      }
    } catch (validateError) {
      console.error('Backup validation failed:', validateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Backup data is corrupted' 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          user_id: backup.user_id,
          backup_code: backup.backup_code,
          app_version: backup.app_version,
          created_at: backup.created_at,
          updated_at: backup.updated_at
        }
      })
    };

  } catch (error) {
    console.error('Get backup error:', error);
    
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

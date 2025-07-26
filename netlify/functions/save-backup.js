/**
 * save-backup.js - Speichert User Backup in der Cloud
 * POST /.netlify/functions/save-backup
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
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

    // Parse request body
    const { userId, backupCode, appVersion } = JSON.parse(event.body);

    // Validate required fields
    if (!userId || !backupCode || !appVersion) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: userId, backupCode, appVersion' 
        })
      };
    }

    // Validate backup code format (should be Base64)
    try {
      const decoded = atob(backupCode);
      const backupData = JSON.parse(decoded);
      if (!backupData || backupData.type !== 'hunter-simulator-backup') {
        throw new Error('Invalid backup format');
      }
    } catch (validateError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid backup code format' 
        })
      };
    }

    // Insert or update user backup
    const result = await sql`
      INSERT INTO user_backups (user_id, backup_code, app_version)
      VALUES (${userId}, ${backupCode}, ${appVersion})
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        backup_code = EXCLUDED.backup_code,
        app_version = EXCLUDED.app_version,
        updated_at = NOW()
      RETURNING user_id, app_version, created_at, updated_at
    `;

    if (!result || result.length === 0) {
      throw new Error('No rows affected by insert/update');
    }

    // Optional: Save to history table
    try {
      await sql`
        INSERT INTO user_backup_history (user_id, backup_code, app_version)
        VALUES (${userId}, ${backupCode}, ${appVersion})
      `;
    } catch (historyError) {
      // Continue - history is optional
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          userId: result[0].user_id,
          appVersion: result[0].app_version,
          createdAt: result[0].created_at,
          updatedAt: result[0].updated_at
        }
      })
    };

  } catch (error) {
    console.error('Save backup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};

// Export both for compatibility
exports.handler = handler;
exports.lambdaHandler = handler;

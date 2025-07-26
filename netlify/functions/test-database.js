/**
 * test-database.js - Testet die Datenbank-Verbindung
 * GET /.netlify/functions/test-database
 */
const { neon } = require('@neondatabase/serverless');

const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
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
    console.log('Testing database connection...');
    
    // Initialize database connection at runtime
    const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;
    
    if (!NEON_DATABASE_URL) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Database configuration error',
          message: 'No database connection string available',
          databaseUrl: '[NOT CONFIGURED]'
        })
      };
    }
    
    const sql = neon(NEON_DATABASE_URL);
    
    // Test 1: Basic connection
    const testResult = await sql`SELECT NOW() as current_time`;
    console.log('Database connection successful:', testResult);

    // Test 2: Check if user_backups table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_backups'
      );
    `;
    console.log('user_backups table exists:', tableExists);

    // Test 3: Count records in user_backups
    let recordCount = null;
    if (tableExists[0].exists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM user_backups`;
      recordCount = countResult[0].count;
      console.log('Records in user_backups:', recordCount);
    }

    // Test 4: Get table structure
    let tableStructure = null;
    if (tableExists[0].exists) {
      tableStructure = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'user_backups' 
        ORDER BY ordinal_position
      `;
      console.log('Table structure:', tableStructure);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          connectionTime: testResult[0].current_time,
          tableExists: tableExists[0].exists,
          recordCount: recordCount,
          tableStructure: tableStructure,
          databaseUrl: '[CONFIGURED]'
        }
      })
    };

  } catch (error) {
    console.error('Database test error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Database connection failed',
        details: error.message
      })
    };
  }
};

// Export both for compatibility
exports.handler = handler;
exports.lambdaHandler = handler;

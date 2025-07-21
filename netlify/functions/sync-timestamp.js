// Netlify Function für Sync Timestamps
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NETLIFY ? 'https://cifi-tools.com' : '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

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
    // Database connection
    const sql = neon(process.env.NEON_DATABASE_URL);

    // Authentication
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No authorization token provided' })
      };
    }

    // Extract user ID from token
    let userId;
    try {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      
      if (decodedToken.startsWith('stack-auth:')) {
        userId = decodedToken.substring(11); // Remove 'stack-auth:' prefix
      } else {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authorization token' })
      };
    }

    // Get last sync timestamp
    const { userId: requestUserId, dataType, clientId } = event.queryStringParameters || {};
    
    // Verify user matches token
    if (requestUserId !== userId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'User ID mismatch' })
      };
    }

    let query;
    if (clientId) {
      query = sql`
        SELECT MAX(sync_timestamp) as timestamp
        FROM sync_logs 
        WHERE user_id = ${userId} AND data_type = ${dataType} AND client_id = ${clientId}
      `;
    } else {
      query = sql`
        SELECT MAX(sync_timestamp) as timestamp
        FROM sync_logs 
        WHERE user_id = ${userId} AND data_type = ${dataType}
      `;
    }

    const result = await query;
    const timestamp = result[0]?.timestamp;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ timestamp })
    };

  } catch (error) {
    console.error('Sync timestamp error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

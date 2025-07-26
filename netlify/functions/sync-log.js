// Netlify Function für Sync Logs
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

  try {
    // Database connection
    const sql = neon(process.env.NEON_DATABASE_URL || process.env.VITE_NEON_DATABASE_URL);

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

    if (event.httpMethod === 'POST') {
      // Log sync action
      const { userId: requestUserId, dataType, action, clientId, dataSnapshot, dataKey } = JSON.parse(event.body);
      
      // Verify user matches token
      if (requestUserId !== userId) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'User ID mismatch' })
        };
      }

      const result = await sql`
        INSERT INTO sync_logs (user_id, data_type, action, client_id, data_snapshot)
        VALUES (${userId}, ${dataType}, ${action}, ${clientId}, ${JSON.stringify(dataSnapshot)})
        RETURNING id, sync_timestamp
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result[0])
      };

    } else if (event.httpMethod === 'GET') {
      // Get sync logs
      const { userId: requestUserId, dataType, since } = event.queryStringParameters || {};
      
      // Verify user matches token
      if (requestUserId !== userId) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'User ID mismatch' })
        };
      }

      let query;
      if (since) {
        query = sql`
          SELECT * FROM sync_logs 
          WHERE user_id = ${userId} AND data_type = ${dataType} AND sync_timestamp > ${since}
          ORDER BY sync_timestamp DESC
          LIMIT 100
        `;
      } else {
        query = sql`
          SELECT * FROM sync_logs 
          WHERE user_id = ${userId} AND data_type = ${dataType}
          ORDER BY sync_timestamp DESC
          LIMIT 100
        `;
      }

      const result = await query;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Sync log error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

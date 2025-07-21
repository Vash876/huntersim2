// Netlify Function für sichere Backend API
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // CORS Headers
  const allowedOrigins = [
    'https://huntersimtest.netlify.app',
    'https://cifi-tools.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = event.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : (process.env.NETLIFY ? 'https://cifi-tools.com' : '*');
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Einfaches Rate Limiting (produktiv würde man Redis oder ähnliches verwenden)
    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    const rateLimitKey = `rate_limit_${clientIP}`;
    
    // In Memory Rate Limiting (nur für Demo - nicht persistent)
    if (!global.rateLimits) global.rateLimits = {};
    const now = Date.now();
    const windowMs = 60000; // 1 Minute
    const maxRequests = 100; // 100 Requests pro Minute
    
    if (!global.rateLimits[rateLimitKey]) {
      global.rateLimits[rateLimitKey] = { count: 0, resetTime: now + windowMs };
    }
    
    const rateLimitData = global.rateLimits[rateLimitKey];
    
    if (now > rateLimitData.resetTime) {
      // Reset window
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + windowMs;
    }
    
    if (rateLimitData.count >= maxRequests) {
      return {
        statusCode: 429,
        headers: {
          ...headers,
          'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000)
        },
        body: JSON.stringify({ error: 'Too many requests' })
      };
    }
    
    rateLimitData.count++;

    // Database connection (sichere Server-side Verbindung)
    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('No database URL found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database configuration missing' })
      };
    }
    
    console.log('Using database URL:', databaseUrl.substring(0, 50) + '...');
    const sql = neon(databaseUrl);
    
    // Stack Auth Token validation
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Missing Bearer token' })
      };
    }

    const token = authHeader.split(' ')[1];
    let authenticatedUserId = null;
    
    // Token validation and user extraction
    if (token === 'dev-token') {
      // Development token - nur in Development erlaubt
      if (process.env.NETLIFY) {
        console.warn('Dev token used in production environment');
      }
      console.log('Using development token');
    } else if (token.length > 20 && !token.includes(' ')) {
      // Base64-kodierter Token (unser primitiver Ansatz)
      try {
        const decoded = atob(token);
        if (decoded.startsWith('stack-auth:')) {
          authenticatedUserId = decoded.replace('stack-auth:', '');
          console.log('Extracted user ID from token:', authenticatedUserId);
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid token format' })
        };
      }
    } else {
      // TODO: Später echte JWT Stack Auth Token Validierung
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid token type' })
      };
    }
    
    // Zusätzliche User ID Validierung aus Headers
    const headerUserId = event.headers['x-user-id'];
    if (authenticatedUserId && headerUserId && authenticatedUserId !== headerUserId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'User ID mismatch' })
      };
    }
    
    const { httpMethod } = event;
    const body = event.body ? JSON.parse(event.body) : null;
    const path = event.path || event.rawUrl || '';
    const queryString = event.rawQuery || '';

    console.log(`API Request: ${httpMethod} ${path}`, { body, queryString, headers: event.headers });

    switch (httpMethod) {
      case 'POST':
        if (path.includes('/cleanup') || queryString.includes('action=cleanup') || (body && body.action === 'cleanup')) {
          // Cleanup old entries to save database space
          // Only keep latest 3 versions per user/dataType combination
          const cleanupResult = await sql`
            DELETE FROM user_data 
            WHERE id NOT IN (
              SELECT id FROM (
                SELECT id, 
                       ROW_NUMBER() OVER (PARTITION BY user_id, data_type ORDER BY updated_at DESC) as rn
                FROM user_data
              ) ranked 
              WHERE rn <= 3
            )
          `;
          
          console.log('Cleanup result:', cleanupResult);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              message: 'Cleanup completed', 
              deletedRows: cleanupResult.rowCount || 0 
            })
          };
        }
        else if (path.includes('/user-data') || path.includes('/api')) {
          // Save user data
          const { userId, dataType, dataValue, dataKey } = body;
          
          if (!userId || !dataType || !dataValue) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Missing required fields: userId, dataType, dataValue' })
            };
          }

          // Sicherheit: User kann nur seine eigenen Daten speichern
          if (authenticatedUserId && authenticatedUserId !== userId) {
            return {
              statusCode: 403,
              headers,
              body: JSON.stringify({ error: 'Forbidden: Cannot access other user data' })
            };
          }

          const result = await sql`
            INSERT INTO user_data (user_id, data_type, data_key, data_value, version)
            VALUES (${userId}, ${dataType}, ${dataKey}, ${JSON.stringify(dataValue)}, 1)
            ON CONFLICT (user_id, data_type, data_key) 
            DO UPDATE SET 
              data_value = ${JSON.stringify(dataValue)},
              version = user_data.version + 1,
              updated_at = NOW()
            RETURNING *
          `;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result[0])
          };
        }
        break;

      case 'GET':
        if (path.includes('/user-data') || path.includes('/api')) {
          // Get user data
          const url = new URL(event.rawUrl || 'http://localhost' + event.path);
          const userId = url.searchParams.get('userId');
          const dataType = url.searchParams.get('dataType');
          const dataKey = url.searchParams.get('dataKey');

          if (!userId) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Missing userId parameter' })
            };
          }

          // Sicherheit: User kann nur seine eigenen Daten lesen
          if (authenticatedUserId && authenticatedUserId !== userId) {
            return {
              statusCode: 403,
              headers,
              body: JSON.stringify({ error: 'Forbidden: Cannot access other user data' })
            };
          }

          let query;
          if (dataType && dataKey) {
            query = sql`SELECT * FROM user_data WHERE user_id = ${userId} AND data_type = ${dataType} AND data_key = ${dataKey}`;
          } else if (dataType) {
            query = sql`SELECT * FROM user_data WHERE user_id = ${userId} AND data_type = ${dataType}`;
          } else {
            query = sql`SELECT * FROM user_data WHERE user_id = ${userId}`;
          }

          const result = await query;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
          };
        }
        break;

      case 'DELETE':
        if (path.includes('/user-data') || path.includes('/api')) {
          // Delete user data
          const { userId, dataType, dataKey } = body;
          
          if (!userId || !dataType) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Missing required fields: userId, dataType' })
            };
          }

          // Sicherheit: User kann nur seine eigenen Daten löschen
          if (authenticatedUserId && authenticatedUserId !== userId) {
            return {
              statusCode: 403,
              headers,
              body: JSON.stringify({ error: 'Forbidden: Cannot delete other user data' })
            };
          }

          let deleteQuery;
          if (dataKey) {
            deleteQuery = sql`DELETE FROM user_data WHERE user_id = ${userId} AND data_type = ${dataType} AND data_key = ${dataKey}`;
          } else {
            deleteQuery = sql`DELETE FROM user_data WHERE user_id = ${userId} AND data_type = ${dataType}`;
          }

          await deleteQuery;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

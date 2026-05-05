import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Create an admin client with service role for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Middleware to verify admin authentication
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('🔍 [AUTH MIDDLEWARE]', {
      path: req.path,
      method: req.method,
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? authHeader.substring(0, 20) + '...' : 'none'
    });

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔴 [AUTH] No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('✅ [AUTH] Token extracted, length:', token.length);

    // Verify token with Supabase Admin client
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error('🔴 [AUTH] Supabase error:', error.message);
      console.error('🔴 [AUTH] Error details:', JSON.stringify(error, null, 2));
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!user) {
      console.error('🔴 [AUTH] No user found for token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('✅ [AUTH] User authenticated:', user.email);

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('🔴 [AUTH] Exception:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};


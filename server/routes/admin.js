import express from 'express';
import { supabase } from '../index.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyAdmin);

// Pages management
router.get('/pages', async (req, res) => {
  try {
    const { lang } = req.query;

    let query = supabase.from('pages').select('*');

    if (lang) {
      query = query.eq('language', lang);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('pages')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog management
router.get('/blog', async (req, res) => {
  try {
    const { lang } = req.query;

    let query = supabase.from('blog_posts').select('*');

    if (lang) {
      query = query.eq('language', lang);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blog', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('blog_posts')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// References management
router.get('/references', async (req, res) => {
  try {
    console.log('Fetching references...');
    const { data, error } = await supabase
      .from('references')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching references:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: error.message,
        details: error.details || error.hint || 'No additional details',
        code: error.code
      });
    }
    
    console.log(`Successfully fetched ${data?.length || 0} references`);
    res.json(data || []);
  } catch (error) {
    console.error('Unexpected error in references GET:', error);
    res.status(500).json({ 
      error: error.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/references', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('references')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      console.error('Error creating reference:', error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('References POST error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/references/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('references')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reference:', error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('References PUT error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/references/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('references')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reference:', error);
      throw error;
    }
    res.json({ success: true });
  } catch (error) {
    console.error('References DELETE error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Services management
router.get('/services', async (req, res) => {
  try {
    const { lang } = req.query;

    let query = supabase.from('services').select('*');

    if (lang) {
      query = query.eq('language', lang);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('services')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Media management
router.get('/media', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/media', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Menu management
router.get('/menu', async (req, res) => {
  try {
    const { lang } = req.query;

    let query = supabase.from('menu_items').select('*');

    if (lang) {
      query = query.eq('language', lang);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/menu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('menu_items')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Newsletter subscribers management
router.get('/newsletter/subscribers', async (req, res) => {
  try {
    const { subscribed, lang } = req.query;

    let query = supabase.from('newsletter_subscribers').select('*');

    if (subscribed !== undefined) {
      query = query.eq('subscribed', subscribed === 'true');
    }
    if (lang) {
      query = query.eq('language', lang);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/newsletter/subscribers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email templates management
router.get('/newsletter/templates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/newsletter/templates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/newsletter/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('email_templates')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/newsletter/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email campaigns management
router.get('/newsletter/campaigns', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/newsletter/campaigns', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/newsletter/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('email_campaigns')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/newsletter/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics (protected)
router.get('/analytics/stats', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = supabase
      .from('page_visits')
      .select('*', { count: 'exact' });

    if (start_date) {
      query = query.gte('visit_date', start_date);
    }
    if (end_date) {
      query = query.lte('visit_date', end_date);
    }

    const { data, error, count } = await query.order('visit_date', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const stats = {
      total_visits: count || 0,
      unique_pages: new Set(data?.map(v => v.page_path) || []).size,
      top_pages: getTopPages(data || []),
      visits_by_date: getVisitsByDate(data || []),
      visits_by_country: getVisitsByCountry(data || []),
      average_duration: getAverageDuration(data || [])
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getTopPages(visits) {
  const pageCounts = {};
  visits.forEach(visit => {
    pageCounts[visit.page_path] = (pageCounts[visit.page_path] || 0) + 1;
  });
  return Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getVisitsByDate(visits) {
  const dateCounts = {};
  visits.forEach(visit => {
    const date = new Date(visit.visit_date).toISOString().split('T')[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  return Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getVisitsByCountry(visits) {
  const countryCounts = {};
  visits.forEach(visit => {
    const country = visit.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });
  return Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

function getAverageDuration(visits) {
  const durations = visits
    .filter(v => v.duration_seconds)
    .map(v => v.duration_seconds);
  if (durations.length === 0) return 0;
  return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
}

// Dashboard Statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get counts for all content types
    const [pagesCount, blogCount, servicesCount, referencesCount, mediaCount, contactCount, newsletterCount] = await Promise.all([
      supabase.from('pages').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('references').select('*', { count: 'exact', head: true }),
      supabase.from('media').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })
    ]);

    // Get recent items
    const [recentPages, recentBlog, recentContact] = await Promise.all([
      supabase.from('pages').select('*').order('updated_at', { ascending: false }).limit(5),
      supabase.from('blog_posts').select('*').order('updated_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    // Get unread contact messages
    const { count: unreadCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    // Get published vs draft counts
    const [publishedBlog, draftBlog, publishedServices] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', false),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('published', true)
    ]);

    res.json({
      counts: {
        pages: pagesCount.count || 0,
        blog: blogCount.count || 0,
        services: servicesCount.count || 0,
        references: referencesCount.count || 0,
        media: mediaCount.count || 0,
        contact: contactCount.count || 0,
        newsletter: newsletterCount.count || 0,
        unread_messages: unreadCount || 0,
        published_blog: publishedBlog.count || 0,
        draft_blog: draftBlog.count || 0,
        published_services: publishedServices.count || 0
      },
      recent: {
        pages: recentPages.data || [],
        blog: recentBlog.data || [],
        contact: recentContact.data || []
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Site Settings management
router.get('/settings', async (req, res) => {
  try {
    const { category, language } = req.query;
    
    let query = supabase.from('site_settings').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (language !== undefined) {
      query = query.or(`language.eq.${language},language.is.null`);
    }
    
    const { data, error } = await query.order('category', { ascending: true });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { language } = req.query;
    
    let query = supabase
      .from('site_settings')
      .select('*')
      .eq('key', key);
    
    if (language) {
      query = query.or(`language.eq.${language},language.is.null`);
    }
    
    const { data, error } = await query.order('language', { ascending: false }).limit(1);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { data: settingData, error } = await supabase
      .from('site_settings')
      .insert(req.body)
      .select()
      .single();
    
    if (error) throw error;
    res.json(settingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('site_settings')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings/key/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { language } = req.query;
    
    // Try to find existing setting
    let query = supabase
      .from('site_settings')
      .select('*')
      .eq('key', key);
    
    if (language) {
      query = query.eq('language', language);
    } else {
      query = query.is('language', null);
    }
    
    const { data: existing, error: findError } = await query;
    
    if (findError) throw findError;
    
    if (existing && existing.length > 0) {
      // Update existing
      const { data, error } = await supabase
        .from('site_settings')
        .update(req.body)
        .eq('id', existing[0].id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('site_settings')
        .insert({ ...req.body, key, language: language || null })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client Logos management
router.get('/client-logos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/client-logos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('client_logos')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/client-logos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('client_logos')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/client-logos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


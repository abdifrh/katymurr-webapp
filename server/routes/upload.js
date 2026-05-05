import express from 'express';
import multer from 'multer';
import { supabase } from '../index.js';

// Middleware to verify admin authentication (copied from admin.js to avoid circular dependency)
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const router = express.Router();

// Configure multer for memory storage (we'll upload directly to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increased for videos)
  },
});

// Helper function to get bucket name based on file type
function getBucketName(mimeType, category = 'media') {
  if (category === 'logo') return 'logos';
  if (category === 'favicon') return 'favicons';
  if (category === 'video' || mimeType?.startsWith('video/')) return 'videos';
  if (mimeType?.startsWith('image/')) return 'media';
  return 'media';
}

// Upload file to Supabase Storage
router.post('/', verifyAdmin, upload.single('file'), async (req, res) => {
  let bucketName = 'media';
  let filePath = '';
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { category = 'media', alt_text = '' } = req.body;
    const file = req.file;
    bucketName = getBucketName(file.mimetype, category);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    // Store files directly in bucket root (buckets are already separated by type)
    filePath = filename;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      console.error('Error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        status: uploadError.status,
        bucket: bucketName,
      });
      
      // Handle RLS policy error (403) or Bad Request (400)
      if (uploadError.statusCode === '403' || uploadError.status === 403 || 
          uploadError.message?.includes('row-level security policy') ||
          uploadError.statusCode === '400' || uploadError.status === 400) {
        return res.status(403).json({ 
          error: `Storage upload failed for bucket '${bucketName}'. This is likely a Row-Level Security (RLS) policy issue.`,
          details: [
            '1. Verify that server/.env uses the SERVICE_ROLE key (not anon key)',
            '2. Check that the bucket exists and is public',
            '3. Configure RLS policies by running server/data/createStorageBuckets.sql',
            '4. See FIX_STORAGE_RLS_400.md for detailed instructions'
          ],
          bucket: bucketName,
          statusCode: uploadError.statusCode || uploadError.status
        });
      }
      
      // If bucket doesn't exist
      if (uploadError.message?.includes('Bucket not found')) {
        return res.status(404).json({ 
          error: `Bucket '${bucketName}' not found. Please create it in Supabase Storage first.`,
          details: 'See SUPABASE_STORAGE_SETUP.md for instructions.',
          bucket: bucketName
        });
      }
      
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Save to media table
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .insert({
        filename: filename,
        original_filename: file.originalname,
        url: publicUrl,
        mime_type: file.mimetype,
        size: file.size,
        alt_text: alt_text,
      })
      .select()
      .single();

    if (mediaError) {
      // If media insert fails, try to delete the uploaded file
      await supabase.storage.from(bucketName).remove([filePath]);
      throw mediaError;
    }

    res.json({
      success: true,
      media: mediaData,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bucket: bucketName,
      filePath: filePath,
    });
    res.status(500).json({ 
      error: error.message || 'Failed to upload file',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      bucket: bucketName
    });
  }
});

// Delete file from Supabase Storage
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get media info
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Extract bucket and path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    let bucketName = 'media';
    let filePath = media.filename;
    
    try {
      const url = new URL(media.url);
      const pathParts = url.pathname.split('/').filter(p => p);
      const storageIndex = pathParts.findIndex(part => part === 'storage');
      if (storageIndex !== -1 && pathParts[storageIndex + 2] === 'public') {
        bucketName = pathParts[storageIndex + 3];
        filePath = pathParts.slice(storageIndex + 4).join('/');
      } else {
        // Fallback: try to extract from filename pattern or use defaults
        if (media.filename.includes('logo') || media.url.includes('logo')) bucketName = 'logos';
        else if (media.filename.includes('favicon') || media.url.includes('favicon')) bucketName = 'favicons';
        // Use the stored filename as path
        filePath = media.filename;
      }
    } catch (error) {
      console.error('Error parsing URL, using defaults:', error);
      // Use defaults based on filename
      if (media.filename.includes('logo')) bucketName = 'logos';
      else if (media.filename.includes('favicon')) bucketName = 'favicons';
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting from storage:', deleteError);
      // Continue to delete from database even if storage delete fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: error.message || 'Failed to delete file' });
  }
});

// Get upload URL (for direct client-side upload if needed)
router.get('/upload-url', verifyAdmin, async (req, res) => {
  try {
    const { filename, category = 'media', mimeType } = req.query;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const bucketName = getBucketName(mimeType, category);
    const filePath = category === 'logo' ? `logos/${filename}` : 
                     category === 'favicon' ? `favicons/${filename}` : 
                     `media/${filename}`;

    // Generate signed URL for upload (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(filePath, {
        upsert: false,
      });

    if (error) throw error;

    res.json({
      signedUrl: data.signedUrl,
      path: filePath,
      token: data.token,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: error.message || 'Failed to generate upload URL' });
  }
});

export default router;


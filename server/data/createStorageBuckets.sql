-- SQL script to create storage buckets in Supabase
-- Note: This must be run in Supabase SQL Editor
-- Storage buckets are created via the Supabase Dashboard, but you can use this as reference

-- IMPORTANT: Buckets must be created manually in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Create buckets: 'media', 'logos', 'favicons', 'videos'
-- 4. Set them as PUBLIC
-- 5. Configure RLS policies (see below)

-- RLS Policies for Storage Buckets
-- Run these after creating the buckets

-- ============================================
-- BUCKET: media
-- ============================================

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow public read access
CREATE POLICY "Allow public read access to media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes from media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- ============================================
-- BUCKET: logos
-- ============================================

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Allow public read access
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes from logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');

-- ============================================
-- BUCKET: favicons
-- ============================================

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to favicons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'favicons');

-- Allow public read access
CREATE POLICY "Allow public read access to favicons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'favicons');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes from favicons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'favicons');

-- ============================================
-- BUCKET: videos
-- ============================================

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow public read access
CREATE POLICY "Allow public read access to videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes from videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos');


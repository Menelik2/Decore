-- ============================================================
-- Decore — Supabase Storage Buckets + RLS Policies
-- Run in SQL Editor AFTER schema.sql (profiles table required)
-- Safe to re-run
-- ============================================================

-- ------------------------------------------------------------
-- 1. Buckets
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'product-images',
    'product-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'gallery-images',
    'gallery-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'event-images',
    'event-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'customer-uploads',
    'customer-uploads',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'videos',
    'videos',
    true,
    52428800,
    ARRAY['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'site-assets',
    'site-assets',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------
-- 2. Helper: staff / admin check (uses public.profiles.role)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('STAFF', 'ADMIN', 'SUPER_ADMIN')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_staff_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff_or_admin() TO anon;

-- ------------------------------------------------------------
-- 3. Drop existing Decore storage policies (idempotent)
-- ------------------------------------------------------------
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname LIKE 'decore_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- 4. PUBLIC buckets — anyone can READ
--    Only STAFF / ADMIN / SUPER_ADMIN can WRITE
-- ------------------------------------------------------------

-- product-images
CREATE POLICY "decore_product_images_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "decore_product_images_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_staff_or_admin()
);

CREATE POLICY "decore_product_images_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_staff_or_admin())
WITH CHECK (bucket_id = 'product-images' AND public.is_staff_or_admin());

CREATE POLICY "decore_product_images_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_staff_or_admin());

-- gallery-images
CREATE POLICY "decore_gallery_images_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

CREATE POLICY "decore_gallery_images_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery-images'
  AND public.is_staff_or_admin()
);

CREATE POLICY "decore_gallery_images_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images' AND public.is_staff_or_admin())
WITH CHECK (bucket_id = 'gallery-images' AND public.is_staff_or_admin());

CREATE POLICY "decore_gallery_images_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images' AND public.is_staff_or_admin());

-- event-images
CREATE POLICY "decore_event_images_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "decore_event_images_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images'
  AND public.is_staff_or_admin()
);

CREATE POLICY "decore_event_images_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND public.is_staff_or_admin())
WITH CHECK (bucket_id = 'event-images' AND public.is_staff_or_admin());

CREATE POLICY "decore_event_images_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND public.is_staff_or_admin());

-- site-assets
CREATE POLICY "decore_site_assets_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

CREATE POLICY "decore_site_assets_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets'
  AND public.is_staff_or_admin()
);

CREATE POLICY "decore_site_assets_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_staff_or_admin())
WITH CHECK (bucket_id = 'site-assets' AND public.is_staff_or_admin());

CREATE POLICY "decore_site_assets_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_staff_or_admin());

-- videos
CREATE POLICY "decore_videos_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

CREATE POLICY "decore_videos_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos'
  AND public.is_staff_or_admin()
);

CREATE POLICY "decore_videos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'videos' AND public.is_staff_or_admin())
WITH CHECK (bucket_id = 'videos' AND public.is_staff_or_admin());

CREATE POLICY "decore_videos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND public.is_staff_or_admin());

-- ------------------------------------------------------------
-- 5. PRIVATE: customer-uploads
-- Path MUST be: {auth.uid()}/...  e.g. uuid/inspiration/photo.jpg
-- Customers: only their own folder
-- Staff/Admin: full access
-- ------------------------------------------------------------

CREATE POLICY "decore_customer_uploads_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'customer-uploads'
  AND (
    public.is_staff_or_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

CREATE POLICY "decore_customer_uploads_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'customer-uploads'
  AND (
    public.is_staff_or_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

CREATE POLICY "decore_customer_uploads_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'customer-uploads'
  AND (
    public.is_staff_or_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
)
WITH CHECK (
  bucket_id = 'customer-uploads'
  AND (
    public.is_staff_or_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

CREATE POLICY "decore_customer_uploads_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'customer-uploads'
  AND (
    public.is_staff_or_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- ------------------------------------------------------------
-- 6. Optional: allow anon read on public buckets is already TO public
-- Storage RLS is enabled by default on storage.objects in Supabase
-- ------------------------------------------------------------

-- Promote yourself to admin (run once, replace email):
-- UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'you@example.com';

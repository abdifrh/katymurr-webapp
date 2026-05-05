-- Ajouter le setting pour l'image CTA
-- À exécuter dans Supabase SQL Editor

INSERT INTO site_settings (key, value, type, category, language, description) VALUES
('cta_image_url', '/images/cta-image.jpg', 'image', 'cta', NULL, 'CTA section image')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  updated_at = NOW();

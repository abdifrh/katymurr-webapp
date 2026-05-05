-- Site Settings Table
-- Stores global site configuration like logo, favicon, SEO metadata, hero image, etc.

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'text', -- 'text', 'image', 'json', 'boolean'
  category VARCHAR(100) NOT NULL DEFAULT 'general', -- 'general', 'seo', 'branding', 'hero', 'social'
  language VARCHAR(2), -- NULL for global settings, 'en' or 'fr' for language-specific
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_language ON site_settings(language);

-- Insert default settings
INSERT INTO site_settings (key, value, type, category, language, description) VALUES
-- General/Branding
('site_name', 'Katy Murr', 'text', 'branding', NULL, 'Site name'),
('site_tagline_en', 'English Coaching, Interpreting & Writing Services', 'text', 'branding', 'en', 'Site tagline in English'),
('site_tagline_fr', 'Coaching en anglais, Interprétation & Services d''écriture', 'text', 'branding', 'fr', 'Site tagline in French'),
('logo_url', '', 'image', 'branding', NULL, 'Main logo URL'),
('favicon_url', '', 'image', 'branding', NULL, 'Favicon URL'),

-- SEO Global
('seo_default_title_en', 'Katy Murr - English Coaching, Interpreting & Writing Services', 'text', 'seo', 'en', 'Default SEO title in English'),
('seo_default_title_fr', 'Katy Murr - Coaching en anglais, Interprétation & Services d''écriture', 'text', 'seo', 'fr', 'Default SEO title in French'),
('seo_default_description_en', 'Professional English coaching, conference interpreting, and writing services. Personalized language training and communication solutions.', 'text', 'seo', 'en', 'Default SEO description in English'),
('seo_default_description_fr', 'Services professionnels de coaching en anglais, interprétation de conférence et écriture. Formation linguistique personnalisée et solutions de communication.', 'text', 'seo', 'fr', 'Default SEO description in French'),
('seo_default_keywords_en', 'English coaching, conference interpreting, writing services, language training, Geneva', 'text', 'seo', 'en', 'Default SEO keywords in English'),
('seo_default_keywords_fr', 'Coaching anglais, interprétation conférence, services écriture, formation linguistique, Genève', 'text', 'seo', 'fr', 'Default SEO keywords in French'),
('seo_author', 'Katy Murr', 'text', 'seo', NULL, 'Site author'),
('seo_og_image', '', 'image', 'seo', NULL, 'Open Graph image for social media sharing'),

-- Hero Section
('hero_media_type', 'image', 'text', 'hero', NULL, 'Hero media type: image or video'),
('hero_image_url', '', 'image', 'hero', NULL, 'Hero section background image'),
('hero_video_url', '', 'text', 'hero', NULL, 'Hero section background video URL'),
('hero_title_en', 'Welcome to Katy Murr', 'text', 'hero', 'en', 'Hero section title in English'),
('hero_title_fr', 'Bienvenue chez Katy Murr', 'text', 'hero', 'fr', 'Hero section title in French'),
('hero_subtitle_en', 'Professional English Coaching, Conference Interpreting & Writing Services', 'text', 'hero', 'en', 'Hero section subtitle in English'),
('hero_subtitle_fr', 'Services professionnels de Coaching en anglais, Interprétation de conférence & Écriture', 'text', 'hero', 'fr', 'Hero section subtitle in French'),
('hero_cta_text_en', 'Start Improving Your Communication Today', 'text', 'hero', 'en', 'Hero CTA button text in English'),
('hero_cta_text_fr', 'Commencez à améliorer votre communication dès aujourd''hui', 'text', 'hero', 'fr', 'Hero CTA button text in French'),
('hero_cta_link', '/contact', 'text', 'hero', NULL, 'Hero CTA button link'),

-- CTA Section
('cta_image_url', '', 'image', 'cta', NULL, 'CTA section image'),

-- Contact Information
('contact_email', 'contact@katymurr.com', 'text', 'contact', NULL, 'Contact email address'),
('contact_phone', '+41 79 658 56 71', 'text', 'contact', NULL, 'Contact phone number'),
('contact_address', '', 'text', 'contact', NULL, 'Contact address'),
('company_number', 'CHE-365.506.039', 'text', 'contact', NULL, 'Registered company number'),

-- Social Media
('social_facebook', '', 'text', 'social', NULL, 'Facebook URL'),
('social_twitter', '', 'text', 'social', NULL, 'Twitter URL'),
('social_linkedin', '', 'text', 'social', NULL, 'LinkedIn URL'),
('social_instagram', '', 'text', 'social', NULL, 'Instagram URL'),

-- Analytics & Tracking
('google_analytics_id', '', 'text', 'analytics', NULL, 'Google Analytics tracking ID'),
('google_tag_manager_id', '', 'text', 'analytics', NULL, 'Google Tag Manager ID'),

-- Footer
('footer_copyright_text', '© 2024 Katy Murr. All rights reserved.', 'text', 'footer', NULL, 'Footer copyright text')

ON CONFLICT (key) DO UPDATE SET
  updated_at = NOW();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();


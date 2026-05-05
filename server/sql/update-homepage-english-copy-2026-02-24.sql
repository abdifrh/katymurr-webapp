-- Update English homepage copy changes (2026-02-24)

-- 1) Hero CTA label (site settings)
UPDATE site_settings
SET
  value = 'Start Improving Your Communication Today',
  updated_at = NOW()
WHERE key = 'hero_cta_text_en';

-- 2) CTA section text inside the English home page HTML content
UPDATE pages
SET
  content = REPLACE(
    REPLACE(
      content,
      'Ready to improve your communication?',
      'Ready to communicate with confidence and influence?'
    ),
    'Let''s work together to achieve your language and communication goals. Get in touch to discuss your project.',
    'Get in touch to discuss your project and start making an impact.'
  ),
  updated_at = NOW()
WHERE slug = 'home' AND language = 'en';

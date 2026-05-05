-- Update French homepage copy changes (2026-02-24)

-- 1) Hero CTA label (site settings)
UPDATE site_settings
SET
  value = 'Commencez à améliorer votre communication dès aujourd''hui',
  updated_at = NOW()
WHERE key = 'hero_cta_text_fr';

-- 2) CTA section text inside the French home page HTML content
UPDATE pages
SET
  content = REPLACE(
    REPLACE(
      REPLACE(
        content,
        'Prêt à améliorer votre communication ?',
        'Prêt à communiquer avec confiance et influence ?'
      ),
      'Travaillons ensemble pour atteindre vos objectifs linguistiques et de communication. Contactez-moi pour discuter de votre projet.',
      'Contactez-nous pour discuter de votre projet et commencer à avoir un impact.'
    ),
    '>Contactez-moi<',
    '>Contactez-nous<'
  ),
  updated_at = NOW()
WHERE slug = 'home' AND language = 'fr';

-- Initial pages data for Katy Murr website
-- Run this in your Supabase SQL editor after creating the pages table
-- This script uses ON CONFLICT to update existing pages or insert new ones

-- Home Page (English)
INSERT INTO pages (slug, title, content, language, meta_title, meta_description, meta_keywords) VALUES
(
  'home',
  'Home',
  '<div class="hero-dynamic-content">
    <h2 class="hero-tagline">Elevate your communication. Master your message.</h2>
    <p class="hero-description">Professional English coaching, conference interpreting, and writing services tailored to help you communicate with confidence and clarity in international settings.</p>
    <div class="hero-actions">
      <a href="/services" class="btn btn-primary">Discover My Services</a>
      <a href="/contact" class="btn btn-secondary">Get in Touch</a>
    </div>
  </div>
  <div class="cta-section-content">
    <h2>Ready to communicate with confidence and influence?</h2>
    <p>Get in touch to discuss your project and start making an impact.</p>
    <div class="cta-actions">
      <a href="/contact" class="btn btn-primary">Get in Touch</a>
      <a href="/services" class="btn btn-secondary">View Services</a>
    </div>
  </div>',
  'en',
  'Katy Murr - English Coaching, Interpreting & Writing Services',
  'Professional English coaching, conference interpreting, and writing services. Personalized language training and content creation tailored to your needs.',
  'English coaching, conference interpreting, writing services, language training, Geneva, Switzerland'
),
-- Home Page (French)
(
  'home',
  'Accueil',
  '<div class="hero-dynamic-content">
    <h2 class="hero-tagline">Élevez votre communication. Maîtrisez votre message.</h2>
    <p class="hero-description">Coaching en anglais professionnel, interprétation de conférence et services d''écriture sur mesure pour vous aider à communiquer avec confiance et clarté dans des contextes internationaux.</p>
    <div class="hero-actions">
      <a href="/services" class="btn btn-primary">Découvrir mes services</a>
      <a href="/contact" class="btn btn-secondary">Contactez-moi</a>
    </div>
  </div>
  <div class="cta-section-content">
    <h2>Prêt à communiquer avec confiance et influence ?</h2>
    <p>Contactez-nous pour discuter de votre projet et commencer à avoir un impact.</p>
    <div class="cta-actions">
      <a href="/contact" class="btn btn-primary">Contactez-nous</a>
      <a href="/services" class="btn btn-secondary">Voir les services</a>
    </div>
  </div>',
  'fr',
  'Katy Murr - Coaching en Anglais, Interprétation & Services d''Écriture',
  'Services professionnels de coaching en anglais, d''interprétation de conférence et d''écriture. Formation linguistique personnalisée et création de contenu adaptés à vos besoins.',
  'coaching anglais, interprétation de conférence, services d''écriture, formation linguistique, Genève, Suisse'
),
-- About Page (English)
(
  'about',
  'About',
  '<h1>About Katy Murr</h1>
  <p>Lakes, rivers & mountains</p>
  <p>Foreign languages and maps spanning far-flung places have always inspired me. I spent my childhood in the UK working my way through my local library''s collection, and my teenage years at the park reading and writing.</p>
  <p>I''m eternally grateful to the BBC (BBC Blast Arts Programme), Manchester Art Gallery and The Tate (Creative Consultants), as well as the British Council (Research Fellowship) for these extraordinary opportunities that shaped my very ordinary world.</p>
  <p>So much so, that after all these adventures, I crossed the channel and Switzerland became my new home. The lakes, rivers and mountains drew me in. I was a tour guide at the Castle of Gruyères, read French and English literature at the University of Lausanne, then headed off to Freie Universität Berlin to brush up on my German.</p>
  <p>Next, the 6th floor of the Uni-Mail building and the nearby swimming pool became my new homes while I studied for my Masters in Conference Interpreting at the University of Geneva.</p>
  <p>Since my MA, I''ve covered conferences in The Hague, in a tiny village in Switzerland called Evolène and, closer to home, at the many international organisations in Geneva. I''ve rediscovered the joy of teaching, which, like interpreting, is another conversation of sorts. I also continue to put pen to paper, for personal projects and commissioned work.</p>',
  'en',
  'About Katy Murr - English Coach, Interpreter & Writer',
  'Learn about Katy Murr, professional English coach, conference interpreter, and writer. MA in Conference Interpreting from the University of Geneva.',
  'Katy Murr, English coach, interpreter, writer, Geneva, Switzerland, conference interpreting'
),
-- About Page (French)
(
  'about',
  'À propos',
  '<h1>À propos de Katy Murr</h1>
  <p>Lacs, rivières et montagnes</p>
  <p>Les langues étrangères et les cartes couvrant des lieux lointains m''ont toujours inspirée. J''ai passé mon enfance au Royaume-Uni à parcourir la collection de ma bibliothèque locale, et mes années d''adolescence au parc à lire et écrire.</p>
  <p>Je suis éternellement reconnaissante à la BBC (BBC Blast Arts Programme), à la Manchester Art Gallery et à The Tate (Creative Consultants), ainsi qu''au British Council (Research Fellowship) pour ces opportunités extraordinaires qui ont façonné mon monde très ordinaire.</p>
  <p>À tel point qu''après toutes ces aventures, j''ai traversé la Manche et la Suisse est devenue ma nouvelle maison. Les lacs, les rivières et les montagnes m''ont attirée. J''ai été guide touristique au Château de Gruyères, j''ai étudié la littérature française et anglaise à l''Université de Lausanne, puis je suis partie à la Freie Universität Berlin pour améliorer mon allemand.</p>
  <p>Ensuite, le 6ème étage du bâtiment Uni-Mail et la piscine voisine sont devenus mes nouveaux foyers pendant que j''étudiais pour mon Master en Interprétation de Conférence à l''Université de Genève.</p>
  <p>Depuis mon Master, j''ai couvert des conférences à La Haye, dans un petit village suisse appelé Evolène et, plus près de chez moi, dans les nombreuses organisations internationales de Genève. J''ai redécouvert la joie d''enseigner, qui, comme l''interprétation, est une autre forme de conversation. Je continue également à mettre la plume au papier, pour des projets personnels et des travaux commandés.</p>',
  'fr',
  'À propos de Katy Murr - Coach en Anglais, Interprète & Écrivaine',
  'Découvrez Katy Murr, coach en anglais, interprète de conférence et écrivaine professionnelle. Master en Interprétation de Conférence de l''Université de Genève.',
  'Katy Murr, coach anglais, interprète, écrivaine, Genève, Suisse, interprétation de conférence'
),
-- Services Page (English)
(
  'services',
  'Services',
  '<h1>Our Services</h1>
  <p>Comprehensive language and writing services tailored to your needs.</p>
  <p>Whether you need English coaching, conference interpreting, translation, proofreading, or creative writing services, I provide professional, personalized solutions to help you achieve your communication goals.</p>',
  'en',
  'Services - English Coaching, Interpreting & Writing | Katy Murr',
  'Professional English coaching, conference interpreting, translation, proofreading, and creative writing services. Tailored solutions for businesses and individuals.',
  'English coaching, conference interpreting, translation, proofreading, writing services, language services'
),
-- Services Page (French)
(
  'services',
  'Services',
  '<h1>Nos Services</h1>
  <p>Services linguistiques et d''écriture complets adaptés à vos besoins.</p>
  <p>Que vous ayez besoin de coaching en anglais, d''interprétation de conférence, de traduction, de correction ou de services d''écriture créative, je propose des solutions professionnelles et personnalisées pour vous aider à atteindre vos objectifs de communication.</p>',
  'fr',
  'Services - Coaching en Anglais, Interprétation & Écriture | Katy Murr',
  'Services professionnels de coaching en anglais, d''interprétation de conférence, de traduction, de correction et d''écriture créative. Solutions adaptées aux entreprises et aux particuliers.',
  'coaching anglais, interprétation de conférence, traduction, correction, services d''écriture, services linguistiques'
),
-- References Page (English)
(
  'references',
  'References',
  '<h1>What Clients Say</h1>
  <p>Testimonials from clients and institutions I''ve had the pleasure of working with.</p>
  <p>These references reflect the quality and professionalism of the services I provide, and I''m grateful for the trust placed in me by clients across various sectors.</p>',
  'en',
  'References & Testimonials - Katy Murr',
  'Read testimonials and references from clients and institutions. Professional English coaching, interpreting, and writing services.',
  'testimonials, references, client reviews, English coaching, interpreting services'
),
-- References Page (French)
(
  'references',
  'Références',
  '<h1>Ce que disent les clients</h1>
  <p>Témoignages de clients et d''institutions avec lesquels j''ai eu le plaisir de travailler.</p>
  <p>Ces références reflètent la qualité et le professionnalisme des services que je fournis, et je suis reconnaissante de la confiance que m''accordent les clients de divers secteurs.</p>',
  'fr',
  'Références & Témoignages - Katy Murr',
  'Lisez les témoignages et références de clients et d''institutions. Services professionnels de coaching en anglais, d''interprétation et d''écriture.',
  'témoignages, références, avis clients, coaching anglais, services d''interprétation'
),
-- Blog Page (English)
(
  'blog',
  'Blog',
  '<h1>Latest from the Blog</h1>
  <p>Insights, tips, and articles about language learning, communication, and professional development.</p>
  <p>Explore our latest articles covering topics from business English to writing tips, and stay updated with valuable content to help you improve your communication skills.</p>',
  'en',
  'Blog - Language Learning & Communication Tips | Katy Murr',
  'Read the latest articles about English learning, communication skills, and professional development. Tips and insights from a professional English coach.',
  'blog, English learning, communication tips, language learning, professional development'
),
-- Blog Page (French)
(
  'blog',
  'Blog',
  '<h1>Derniers articles du blog</h1>
  <p>Conseils, idées et articles sur l''apprentissage des langues, la communication et le développement professionnel.</p>
  <p>Explorez nos derniers articles couvrant des sujets allant de l''anglais des affaires aux conseils d''écriture, et restez informé avec du contenu précieux pour vous aider à améliorer vos compétences en communication.</p>',
  'fr',
  'Blog - Conseils d''Apprentissage des Langues & Communication | Katy Murr',
  'Lisez les derniers articles sur l''apprentissage de l''anglais, les compétences en communication et le développement professionnel. Conseils et idées d''un coach en anglais professionnel.',
  'blog, apprentissage anglais, conseils communication, apprentissage langues, développement professionnel'
),
-- Contact Page (English)
(
  'contact',
  'Contact',
  '<h1>Get in Touch</h1>
  <p>Ready to improve your communication? Let''s work together to achieve your language and communication goals.</p>
  <p>Whether you need English coaching, conference interpreting, translation, or writing services, I''m here to help. Get in touch to discuss your project and receive a personalized quote.</p>
  <p><strong>Phone:</strong> <a href="tel:+41796585671">+41 79 658 56 71</a></p>
  <p><strong>Email:</strong> <a href="mailto:contact@katymurr.com">contact@katymurr.com</a></p>
  <p><strong>Location:</strong> Geneva, Switzerland</p>
  <p><strong>Company Number:</strong> CHE-365.506.039</p>',
  'en',
  'Contact - Katy Murr | Get in Touch',
  'Contact Katy Murr for English coaching, conference interpreting, translation, and writing services. Based in Geneva, Switzerland.',
  'contact, Katy Murr, Geneva, Switzerland, English coaching, interpreting services'
),
-- Contact Page (French)
(
  'contact',
  'Contact',
  '<h1>Contactez-moi</h1>
  <p>Prêt à améliorer votre communication ? Travaillons ensemble pour atteindre vos objectifs linguistiques et de communication.</p>
  <p>Que vous ayez besoin de coaching en anglais, d''interprétation de conférence, de traduction ou de services d''écriture, je suis là pour vous aider. Contactez-moi pour discuter de votre projet et recevoir un devis personnalisé.</p>
  <p><strong>Téléphone :</strong> <a href="tel:+41796585671">+41 79 658 56 71</a></p>
  <p><strong>Email :</strong> <a href="mailto:contact@katymurr.com">contact@katymurr.com</a></p>
  <p><strong>Localisation :</strong> Genève, Suisse</p>
  <p><strong>Numéro d''entreprise :</strong> CHE-365.506.039</p>',
  'fr',
  'Contact - Katy Murr | Contactez-moi',
  'Contactez Katy Murr pour des services de coaching en anglais, d''interprétation de conférence, de traduction et d''écriture. Basée à Genève, Suisse.',
  'contact, Katy Murr, Genève, Suisse, coaching anglais, services d''interprétation'
)
ON CONFLICT (slug, language) 
DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

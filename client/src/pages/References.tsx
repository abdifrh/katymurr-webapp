import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { fetchReferences } from '../services/api'
import ReferenceCard from '../components/ReferenceCard/ReferenceCard'
import Loader from '../components/Loader/Loader'
import AnimatedSection from '../components/AnimatedSection/AnimatedSection'
import LogoCarousel from '../components/LogoCarousel/LogoCarousel'
import './References.css'

interface Reference {
  id: string
  name: string
  position: string
  institution: string
  institution_logo: string
  testimonial: string
  featured: boolean
  language: string
}

function References() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [allReferences, setAllReferences] = useState<Reference[]>([])
  const [filterLanguage, setFilterLanguage] = useState<string>('all') // 'all', 'en', 'fr'
  const [loading, setLoading] = useState(true)
  
  const siteName = getSetting('site_name') || 'Katy Murr'
  const seoTitle = getSetting('seo_default_title', language) || `${siteName} - References`
  const seoDescription = getSetting('seo_default_description', language) || 'Testimonials and references from clients and institutions.'

  // Charger toutes les références (en et fr) au chargement
  useEffect(() => {
    const loadReferences = async () => {
      try {
        setLoading(true)
        // Charger les références en anglais et français
        const [refsEn, refsFr] = await Promise.all([
          fetchReferences('en'),
          fetchReferences('fr')
        ])
        
        // Combiner toutes les références (elles ont déjà le champ language de la DB)
        const combined = [
          ...(refsEn || []),
          ...(refsFr || [])
        ]
        
        setAllReferences(combined)
      } catch (error) {
        console.error('Error loading references:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReferences()
  }, []) // Ne dépend pas de la langue du site

  // Filtrer les références selon la sélection
  const filteredReferences = filterLanguage === 'all' 
    ? allReferences 
    : allReferences.filter(ref => ref.language === filterLanguage)

  if (loading) {
    return (
      <div className="references-page">
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="references, testimonials, clients, institutions, english coaching, interpreting" />
        <link rel="canonical" href="https://katymurr.com/references" />
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://katymurr.com/references" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className="references-page">
        <AnimatedSection animation="fadeInUp">
          <section className="section page-header">
            <div className="container">
              <h1>{language === 'en' ? 'References' : 'Références'}</h1>
            <p className="page-intro">
              {language === 'en'
                ? 'Testimonials and references from clients and institutions I\'ve worked with.'
                : 'Témoignages et références de clients et d\'institutions avec lesquels j\'ai travaillé.'
              }
            </p>
          </div>
        </section>
        </AnimatedSection>

        {filteredReferences.length === 0 ? (
          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <section className="section">
              <div className="container">
                <p className="text-center">
                  {language === 'en'
                    ? 'No references available at this time.'
                    : 'Aucune référence disponible pour le moment.'
                  }
                </p>
              </div>
            </section>
          </AnimatedSection>
        ) : (
          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <section className="section references-content">
              <div className="container">
                {/* Sélecteur de langue pour les avis */}
                <div className="references-language-filter">
                  <label htmlFor="reference-language-select">
                    {language === 'en' ? 'Filter by language:' : 'Filtrer par langue :'}
                  </label>
                  <select
                    id="reference-language-select"
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="reference-language-select"
                  >
                    <option value="all">
                      {language === 'en' ? 'All languages' : 'Toutes les langues'}
                    </option>
                    <option value="en">
                      {language === 'en' ? 'English' : 'Anglais'}
                    </option>
                    <option value="fr">
                      {language === 'en' ? 'French' : 'Français'}
                    </option>
                  </select>
                </div>

                <div className="references-grid">
                  {filteredReferences.map((ref) => (
                    <ReferenceCard
                      key={ref.id}
                      id={ref.id}
                      name={ref.name}
                      position={ref.position}
                      institution={ref.institution}
                      institution_logo={ref.institution_logo}
                      testimonial={ref.testimonial}
                      featured={ref.featured}
                      maxLength={250}
                      language={ref.language} // Utiliser la langue de la référence, pas celle du site
                    />
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <LogoCarousel />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <section className="section references-cta">
            <div className="container">
              <div className="references-cta-content">
                <p className="references-cta-text">
                  {language === 'en'
                    ? 'Ready to communicate with clarity, confidence, and impact? Let\'s start the conversation.'
                    : 'Prêt à communiquer avec clarté, confiance et impact ? Commençons la conversation.'}
                </p>
                <div className="references-cta-buttons">
                  <a href="/contact" className="btn btn-primary">
                    <i className="fas fa-paper-plane cta-contact-icon" aria-hidden="true"></i>
                    {language === 'en' ? 'Get in Touch' : 'Contactez-nous'}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </>
  )
}

export default References

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { fetchServices } from '../services/api'
import Loader from '../components/Loader/Loader'
import AnimatedSection from '../components/AnimatedSection/AnimatedSection'
import { SEO, BreadcrumbSchema } from '../components/SEO/SEO'
import './Services.css'

interface Service {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  icon?: string
  featured_image?: string
  order_index: number
}

function Services() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const location = useLocation()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  const siteName = getSetting('site_name') || 'Katy Murr'
  const seoTitle = getSetting('seo_default_title', language) || `${siteName} - Services`
  const seoDescription = getSetting('seo_default_description', language) || 'Professional English coaching, conference interpreting, and writing services.'

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        const data = await fetchServices(language, true)
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [language])

  useEffect(() => {
    // Gérer le scroll vers l'ancre après le chargement de la page
    if (location.hash) {
      const elementId = location.hash.substring(1) // Enlever le #
      const element = document.getElementById(elementId)
      
      if (element) {
        // Petit délai pour s'assurer que le DOM est prêt
        setTimeout(() => {
          const headerOffset = 120 // Hauteur de la navbar
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }, [location.hash])

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="english coaching, conference interpreting, writing services, professional services" />
        <link rel="canonical" href="https://katymurr.com/services" />
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://katymurr.com/services" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      {/* SEO Enhancements */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />

      <div className="services-page">
        <AnimatedSection animation="fadeInUp">
          <section className="section page-header">
            <div className="container">
              <h1>{language === 'en' ? 'Services' : 'Services'}</h1>
            <p className="page-intro">
              {language === 'en'
                ? 'Comprehensive language and writing services tailored to your needs.'
                : 'Services linguistiques et d\'écriture adaptés à vos besoins.'
              }
            </p>
          </div>
        </section>
        </AnimatedSection>

        {loading ? (
          <section className="section">
            <Loader text={language === 'en' ? 'Loading services...' : 'Chargement des services...'} />
          </section>
        ) : (
          <>
            {services.map((service, index) => (
              <AnimatedSection
                key={service.id}
                animation={index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}
                delay={index * 0.1}
              >
                <section
                  id={service.slug}
                  className={`section service-section ${service.featured_image ? 'service-section-with-bg' : ''}`}
                >
                  {service.featured_image && (
                    <div className="service-bg-wrapper">
                      <img
                        src={service.featured_image}
                        alt={service.title}
                        className="service-bg-image"
                      />
                      <div className="service-bg-overlay"></div>
                    </div>
                  )}
                  <span className="service-section-number">{(index + 1).toString().padStart(2, '0')}</span>
                  <div className="container">
                    <div className="service-content">
                      <div className="service-text">
                        <h2>{service.title}</h2>
                        {service.subtitle && (
                          <p className="service-subtitle">{service.subtitle}</p>
                        )}
                        {service.description && (
                          <p>{service.description}</p>
                        )}
                        <Link to={`/services/${service.slug}`} className="btn btn-primary">
                          {language === 'en' ? 'Learn more →' : 'En savoir plus →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </AnimatedSection>
            ))}
          </>
        )}

        {/* CTA Section */}
        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>
                {language === 'en'
                  ? 'Ready to Get Started?'
                  : 'Prêt à commencer ?'
                }
              </h2>
              <p>
                {language === 'en'
                  ? 'Contact me to discuss your project and how I can help you achieve your goals.'
                  : 'Contactez-moi pour discuter de votre projet et voir comment je peux vous aider à atteindre vos objectifs.'
                }
              </p>
              <a href="/contact" className="btn btn-primary">
                {language === 'en' ? 'Get in Touch' : 'Contactez-moi'}
              </a>
            </div>
          </div>
        </section>
        </AnimatedSection>
      </div>
    </>
  )
}

export default Services


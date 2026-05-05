import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { fetchService, fetchServices } from '../services/api'
import Loader from '../components/Loader/Loader'
import { SEO, BreadcrumbSchema, ServiceSchema } from '../components/SEO/SEO'
import './ServiceDetail.css'

interface ServiceContent {
  sections?: Array<{
    type: 'text' | 'list' | 'steps' | 'roi' | 'cta'
    title?: string
    content?: string
    items?: string[]
    steps?: Array<{
      title: string
      description?: string
    }>
    value?: string
    description?: string
  }>
}

interface Service {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  content: ServiceContent
  language: string
  featured_image?: string
  icon?: string
  order_index: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [service, setService] = useState<Service | null>(null)
  const [serviceNumber, setServiceNumber] = useState<string>('01')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contactEmail = getSetting('contact_email') || 'contact@katymurr.com'
  const contactPhone = getSetting('contact_phone') || '+41 79 658 56 71'

  useEffect(() => {
    const loadService = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        // Charger le service actuel et tous les services pour obtenir le numéro
        const [serviceData, allServices] = await Promise.all([
          fetchService(slug, language),
          fetchServices(language, true)
        ])

        setService(serviceData)

        // Trouver l'index du service actuel dans la liste triée
        const sortedServices = allServices.sort((a: Service, b: Service) => a.order_index - b.order_index)
        const index = sortedServices.findIndex((s: Service) => s.id === serviceData.id)
        const number = (index + 1).toString().padStart(2, '0')
        setServiceNumber(number)
      } catch (err: any) {
        console.error('Error loading service:', err)
        setError(err.message || 'Service not found')
      } finally {
        setLoading(false)
      }
    }

    loadService()
  }, [slug, language])

  if (loading) {
    return (
      <div className="service-detail-page">
        <Loader fullScreen />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="service-detail-page">
        <div className="container">
          <h1>{language === 'en' ? 'Service Not Found' : 'Service introuvable'}</h1>
          <p>{error || (language === 'en' ? 'The requested service could not be found.' : 'Le service demandé est introuvable.')}</p>
          <Link to="/services" className="btn btn-primary">
            {language === 'en' ? 'Back to Services' : 'Retour aux services'}
          </Link>
        </div>
      </div>
    )
  }

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={index} className="service-section-text">
            {section.title && <h3>{section.title}</h3>}
            {section.content && <p>{section.content}</p>}
          </div>
        )

      case 'list':
        return (
          <div key={index} className="service-section-list">
            {section.title && <h3>{section.title}</h3>}
            {section.items && (
              <ul className="service-list">
                {section.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )

      case 'steps':
        return (
          <div key={index} className="service-section-steps">
            {section.title && <h3>{section.title}</h3>}
            {section.steps && (
              <ol className="service-steps">
                {section.steps.map((step: any, i: number) => (
                  <li key={i}>
                    <strong>{step.title}</strong>
                    {step.description && <p>{step.description}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )

      case 'roi':
        return (
          <div key={index} className="service-section-roi">
            {section.title && <h3>{section.title}</h3>}
            {section.value && <p className="roi-value">{section.value}</p>}
            {section.description && <p>{section.description}</p>}
            {section.items && (
              <ul className="roi-list">
                {section.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )

      case 'cta':
        return (
          <div key={index} className="service-section-cta">
            {section.title && <h3>{section.title}</h3>}
            {section.content && <p>{section.content}</p>}
            <div className="service-cta-buttons">
              <a href="/contact" className="btn btn-primary">
                {language === 'en' ? 'Get in Touch' : 'Contactez-moi'}
              </a>
              {contactPhone && (
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="btn btn-secondary">
                  {contactPhone}
                </a>
              )}
              <a href={`mailto:${contactEmail}`} className="btn btn-secondary">
                {contactEmail}
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Helmet>
        <title>{service.meta_title || `${service.title} - Katy Murr`}</title>
        <meta name="description" content={service.meta_description || service.description || ''} />
        {service.meta_keywords && <meta name="keywords" content={service.meta_keywords} />}
        <link rel="canonical" href={`https://katymurr.com/services/${service.slug}`} />
        {/* Open Graph */}
        <meta property="og:title" content={service.meta_title || service.title} />
        <meta property="og:description" content={service.meta_description || service.description || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://katymurr.com/services/${service.slug}`} />
        {service.featured_image && (
          <meta property="og:image" content={service.featured_image.startsWith('http') ? service.featured_image : `https://katymurr.com${service.featured_image}`} />
        )}
        {/* Twitter */}
        <meta name="twitter:card" content={service.featured_image ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={service.meta_title || service.title} />
        <meta name="twitter:description" content={service.meta_description || service.description || ''} />
        {service.featured_image && (
          <meta name="twitter:image" content={service.featured_image.startsWith('http') ? service.featured_image : `https://katymurr.com${service.featured_image}`} />
        )}
      </Helmet>

      {/* SEO Enhancements */}
      <SEO
        title={service.meta_title || service.title}
        description={service.meta_description || service.description || ''}
        image={service.featured_image}
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
          { name: 'Services', url: '/services' },
          { name: service.title, url: `/services/${service.slug}` },
        ]}
      />
      <ServiceSchema
        name={service.title}
        description={service.meta_description || service.description || ''}
        url={`/services/${service.slug}`}
        image={service.featured_image}
      />

      <div className="service-detail-page">
        <section className="section service-header">
          {service.featured_image && (
            <>
              <div className="service-hero-background">
                <img src={service.featured_image} alt={service.title} className="service-hero-image" />
                <div className="service-hero-overlay"></div>
              </div>
              <span className="service-hero-number">{serviceNumber}</span>
            </>
          )}
          <div className="container">
            <Link to="/services" className="back-link">
              ← {language === 'en' ? 'Back to Services' : 'Retour aux services'}
            </Link>
            <h1>{service.title}</h1>
            {service.subtitle && <p className="service-subtitle">{service.subtitle}</p>}
            {service.description && <p className="service-description">{service.description}</p>}
          </div>
        </section>

        <section className="section service-content-section">
          <div className="container">
            <div className="service-content">
              {service.content?.sections?.map((section, index) => renderSection(section, index))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ServiceDetail


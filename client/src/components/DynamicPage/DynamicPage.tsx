
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../../contexts/LanguageContext'
import { fetchPage } from '../../services/api'
import Loader from '../Loader/Loader'
import AnimatedSection from '../AnimatedSection/AnimatedSection'
import { SEO, BreadcrumbSchema } from '../SEO/SEO'
import './DynamicPage.css'

interface Page {
  id: string
  slug: string
  title: string
  content: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

interface DynamicPageProps {
  slug: string
  fallbackTitle: string
  fallbackContent?: React.ReactNode
  fallbackMetaDescription?: string
  className?: string
}

function DynamicPage({ 
  slug, 
  fallbackTitle, 
  fallbackContent, 
  fallbackMetaDescription,
  className = ''
}: DynamicPageProps) {
  const { language } = useLanguage()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchPage(slug, language)
        setPage(data)
      } catch (err: any) {
        // Si la page n'existe pas dans la DB, on utilise le fallback
        console.log(`Page ${slug} not found in database, using fallback content`)
        setError('not_found')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [slug, language])

  // Si on charge ou si on a une erreur et pas de fallback, afficher le loader
  if (loading || (error && !fallbackContent)) {
    return (
      <div className={`dynamic-page ${className}`}>
        <Loader fullScreen />
      </div>
    )
  }

  // Si la page existe dans la DB, utiliser son contenu
  if (page && !error) {
    return (
      <>
        <Helmet>
          <title>{page.meta_title || `${page.title} - Katy Murr`}</title>
          <meta name="description" content={page.meta_description || fallbackMetaDescription || ''} />
          {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
          <link rel="canonical" href={`https://katymurr.com/${page.slug}`} />
          {/* Open Graph */}
          <meta property="og:title" content={page.meta_title || page.title} />
          <meta property="og:description" content={page.meta_description || fallbackMetaDescription || ''} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://katymurr.com/${page.slug}`} />
          {page.featured_image && (
            <meta property="og:image" content={page.featured_image.startsWith('http') ? page.featured_image : `https://katymurr.com${page.featured_image}`} />
          )}
          {/* Twitter */}
          <meta name="twitter:card" content={page.featured_image ? "summary_large_image" : "summary"} />
          <meta name="twitter:title" content={page.meta_title || page.title} />
          <meta name="twitter:description" content={page.meta_description || fallbackMetaDescription || ''} />
          {page.featured_image && (
            <meta name="twitter:image" content={page.featured_image.startsWith('http') ? page.featured_image : `https://katymurr.com${page.featured_image}`} />
          )}
        </Helmet>

        {/* SEO Enhancements */}
        <SEO
          title={page.meta_title || page.title}
          description={page.meta_description || fallbackMetaDescription || ''}
          image={page.featured_image}
          type="website"
        />
        <BreadcrumbSchema
          items={[
            { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
            { name: page.title, url: `/${page.slug}` },
          ]}
        />

        <div className={`dynamic-page ${className}`}>
          <AnimatedSection animation="fadeInUp">
            <section className="section page-header">
              <div className="container">
                <h1>{page.title}</h1>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <section className="section page-content">
              <div className="container">
                {page.featured_image ? (
                  <div className="page-content-with-image">
                    <div className="page-image">
                      <img 
                        src={page.featured_image} 
                        alt={page.title}
                        className="page-featured-image"
                      />
                    </div>
                    <div className="page-text">
                      <div 
                        className="dynamic-content"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                      />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="dynamic-content"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                )}
              </div>
            </section>
          </AnimatedSection>
        </div>
      </>
    )
  }

  // Sinon, utiliser le contenu fallback
  return (
    <>
      <Helmet>
        <title>{fallbackTitle} - Katy Murr</title>
        <meta name="description" content={fallbackMetaDescription || ''} />
        <link rel="canonical" href={`https://katymurr.com/${slug}`} />
        {/* Open Graph */}
        <meta property="og:title" content={fallbackTitle} />
        <meta property="og:description" content={fallbackMetaDescription || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://katymurr.com/${slug}`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={fallbackTitle} />
        <meta name="twitter:description" content={fallbackMetaDescription || ''} />
      </Helmet>

      {/* SEO Enhancements */}
      <SEO
        title={fallbackTitle}
        description={fallbackMetaDescription || ''}
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
          { name: fallbackTitle, url: `/${slug}` },
        ]}
      />

      <div className={`dynamic-page ${className}`}>
        {fallbackContent}
      </div>
    </>
  )
}

export default DynamicPage


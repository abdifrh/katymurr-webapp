import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const SITE_URL = 'https://katymurr.com'
const SITE_NAME = 'Katy Murr'

// Organization/Person Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Katy Murr',
  url: SITE_URL,
  image: `${SITE_URL}/images/katy-murr.jpg`,
  description: 'Professional English coach, conference interpreter, and writer based in Switzerland.',
  jobTitle: 'English Coach, Conference Interpreter & Writer',
  worksFor: {
    '@type': 'Organization',
    name: 'Katy Murr',
    url: SITE_URL,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Geneva',
    addressCountry: 'CH',
  },
  email: 'contact@katymurr.com',
  telephone: '+41 79 658 56 71',
  sameAs: [
    'https://www.linkedin.com/in/katymurr/',
  ],
  knowsLanguage: ['en', 'fr', 'de'],
}

// Website Schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: 'Professional English coaching, conference interpreting, and writing services.',
  publisher: {
    '@id': `${SITE_URL}/#person`,
  },
  inLanguage: ['en', 'fr'],
}

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    category?: string
  }
  noindex?: boolean
}

function SEO({ type = 'website', article, noindex = false }: SEOProps) {
  const location = useLocation()
  const { language } = useLanguage()

  // Generate alternate language URL
  const getAlternateUrl = (lang: string) => {
    const baseUrl = `${SITE_URL}${location.pathname}`
    if (lang === 'en') {
      return baseUrl
    }
    return `${baseUrl}${location.pathname.includes('?') ? '&' : '?'}lang=${lang}`
  }

  return (
    <Helmet>
      {/* hreflang tags for multilingual SEO */}
      <link rel="alternate" hrefLang="en" href={getAlternateUrl('en')} />
      <link rel="alternate" hrefLang="fr" href={getAlternateUrl('fr')} />
      <link rel="alternate" hrefLang="x-default" href={getAlternateUrl('en')} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Article specific meta */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {type === 'article' && article?.category && (
        <meta property="article:section" content={article.category} />
      )}

      {/* Language */}
      <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'fr' ? 'en_US' : 'fr_FR'} />
    </Helmet>
  )
}

// Breadcrumb Schema Component
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  )
}

// Service Schema Component
interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  image?: string
}

function ServiceSchema({ name, description, url, image }: ServiceSchemaProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    provider: {
      '@id': `${SITE_URL}/#person`,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    ...(image && { image: image.startsWith('http') ? image : `${SITE_URL}${image}` }),
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  )
}

// Article Schema Component
interface ArticleSchemaProps {
  headline: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
  category?: string
}

function ArticleSchema({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  category
}: ArticleSchemaProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    author: {
      '@id': `${SITE_URL}/#person`,
    },
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${SITE_URL}${url}`,
    },
    ...(image && { image: image.startsWith('http') ? image : `${SITE_URL}${image}` }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(category && { articleSection: category }),
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  )
}

// Global Schema (Organization + Website) - use on homepage
function GlobalSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  )
}

// LocalBusiness Schema for Contact page
function LocalBusinessSchema() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Katy Murr - Language Services',
    description: 'Professional English coaching, conference interpreting, and writing services.',
    url: SITE_URL,
    telephone: '+41 79 658 56 71',
    email: 'contact@katymurr.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Geneva',
      addressCountry: 'CH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.2044,
      longitude: 6.1432,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
    image: `${SITE_URL}/images/katy-murr.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/katymurr/',
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  )
}

export {
  SEO,
  GlobalSchema,
  BreadcrumbSchema,
  ServiceSchema,
  ArticleSchema,
  LocalBusinessSchema,
  SITE_URL,
  SITE_NAME
}

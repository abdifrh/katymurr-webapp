import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { fetchBlogPosts, fetchCategories } from '../services/api'
import Loader from '../components/Loader/Loader'
import AnimatedSection from '../components/AnimatedSection/AnimatedSection'
import { SEO, BreadcrumbSchema } from '../components/SEO/SEO'
import './Blog.css'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  category: string
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

function Blog() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  
  const siteName = getSetting('site_name') || 'Katy Murr'
  const seoTitle = getSetting('seo_default_title', language) || `${siteName} - Blog`
  const seoDescription = getSetting('seo_default_description', language) || 'Articles and insights on English coaching, interpreting, and writing.'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [postsData, categoriesData] = await Promise.all([
          fetchBlogPosts(language, undefined, selectedCategory),
          fetchCategories(language)
        ])
        setPosts(postsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading blog data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [language, selectedCategory])

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="blog, articles, english coaching, interpreting, writing, language learning" />
        <link rel="canonical" href="https://katymurr.com/blog" />
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://katymurr.com/blog" />
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
          { name: language === 'en' ? 'Blog' : 'Journal', url: '/blog' },
        ]}
      />

      <div className="blog-page">
        <AnimatedSection animation="fadeInUp">
          <section className="section page-header">
            <div className="container">
              <h1>{language === 'en' ? 'Blog' : 'Journal'}</h1>
            <p className="page-intro">
              {language === 'en'
                ? 'Insights, tips, and stories about language, communication, and writing.'
                : 'Réflexions, conseils et histoires sur les langues, la communication et l\'écriture.'
              }
            </p>
          </div>
        </section>
        </AnimatedSection>

        {categories.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <section className="section blog-filters">
            <div className="container">
              <div className="category-filters">
                <button
                  className={`category-filter ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  {language === 'en' ? 'All' : 'Tous'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-filter ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>
          </AnimatedSection>
        )}

        {loading ? (
          <section className="section">
            <Loader />
          </section>
        ) : posts.length === 0 ? (
          <section className="section">
            <div className="container">
              <p className="text-center">
                {language === 'en'
                  ? 'No blog posts available at this time.'
                  : 'Aucun article disponible pour le moment.'
                }
              </p>
            </div>
          </section>
        ) : (
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <section className="section blog-content">
              <div className="container">
                <div className="blog-grid">
                {posts.map((post) => (
                  <article key={post.id} className="blog-card">
                    {post.featured_image && (
                      <Link to={`/blog/${post.slug}`} className="blog-card-image">
                        <img src={post.featured_image} alt={post.title} />
                      </Link>
                    )}
                    <div className="blog-card-content">
                      {post.category && (
                        <span className="blog-category">{post.category}</span>
                      )}
                      <h2>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <div className="blog-meta">
                        <time dateTime={post.created_at}>
                          {new Date(post.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="blog-link">
                        {language === 'en' ? 'Read more →' : 'Lire la suite →'}
                      </Link>
                    </div>
                  </article>
                ))}
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}
      </div>
    </>
  )
}

export default Blog


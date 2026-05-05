import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { fetchBlogPost } from '../services/api'
import Loader from '../components/Loader/Loader'
import { SEO, BreadcrumbSchema, ArticleSchema } from '../components/SEO/SEO'
import './BlogPost.css'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image: string
  category: string
  meta_title: string
  meta_description: string
  created_at: string
  author: string
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { language } = useLanguage()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return
      try {
        setLoading(true)
        const data = await fetchBlogPost(language, slug)
        setPost(data)
      } catch (error) {
        console.error('Error loading blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug, language])

  if (loading) {
    return (
      <div className="blog-post-page">
        <Loader fullScreen />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <p>{language === 'en' ? 'Post not found.' : 'Article non trouvé.'}</p>
          <Link to="/blog">{language === 'en' ? 'Back to Blog' : 'Retour au journal'}</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} - Katy Murr</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        <meta name="keywords" content={post.category ? `${post.category}, blog, article` : 'blog, article'} />
        <link rel="canonical" href={`https://katymurr.com/blog/${post.slug}`} />
        {/* Open Graph */}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://katymurr.com/blog/${post.slug}`} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image.startsWith('http') ? post.featured_image : `https://katymurr.com${post.featured_image}`} />
        )}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt || post.title} />
        {post.featured_image && (
          <meta name="twitter:image" content={post.featured_image.startsWith('http') ? post.featured_image : `https://katymurr.com${post.featured_image}`} />
        )}
      </Helmet>

      {/* SEO Enhancements */}
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || post.title}
        image={post.featured_image}
        type="article"
        article={{
          publishedTime: post.created_at,
          author: post.author || 'Katy Murr',
          category: post.category,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <ArticleSchema
        headline={post.title}
        description={post.meta_description || post.excerpt || post.title}
        url={`/blog/${post.slug}`}
        image={post.featured_image}
        datePublished={post.created_at}
        category={post.category}
      />

      <div className="blog-post-page">
        <article className="blog-post">
          {post.featured_image && (
            <div className="blog-post-hero">
              <img src={post.featured_image} alt={post.title} />
            </div>
          )}

          <div className="container">
            <div className="blog-post-header">
              <Link to="/blog" className="back-link">
                ← {language === 'en' ? 'Back to Blog' : 'Retour au journal'}
              </Link>
              {post.category && (
                <span className="blog-category">{post.category}</span>
              )}
              <h1>{post.title}</h1>
              <div className="blog-post-meta">
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.author && <span>by {post.author}</span>}
              </div>
            </div>

            <div 
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </>
  )
}

export default BlogPost


import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { fetchReferences, fetchBlogPosts, fetchServices, fetchPage } from '../services/api'
import ReferenceCard from '../components/ReferenceCard/ReferenceCard'
import Loader from '../components/Loader/Loader'
import AnimatedSection from '../components/AnimatedSection/AnimatedSection'
import LogoCarousel from '../components/LogoCarousel/LogoCarousel'
import { GlobalSchema, SEO } from '../components/SEO/SEO'
import './Home.css'

interface Reference {
  id: string
  name: string
  position: string
  institution: string
  institution_logo?: string
  testimonial: string
  language: string
  featured: boolean
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  created_at: string
}

interface Service {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  order_index: number
}

interface HomePage {
  id: string
  slug: string
  title: string
  content: string
  meta_title?: string
  meta_description?: string
}

function Home() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [featuredReferences, setFeaturedReferences] = useState<Reference[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [homePage, setHomePage] = useState<HomePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [testimonialFading, setTestimonialFading] = useState(false)

  // Récupérer les valeurs hero dynamiquement depuis les settings
  // Utiliser settings dans les dépendances pour forcer le re-render quand les settings changent
  const heroMediaType = getSetting('hero_media_type') || 'image'
  const heroImageUrl = getSetting('hero_image_url') || '/images/hero-image.jpg'
  const heroVideoUrl = getSetting('hero_video_url') || ''
  const heroTitle = getSetting('hero_title', language) || (language === 'en' ? 'Welcome to Katy Murr' : 'Bienvenue chez Katy Murr')
  const heroSubtitle = getSetting('hero_subtitle', language) || (language === 'en' ? 'Professional English Coaching, Conference Interpreting & Writing Services' : 'Services professionnels de Coaching en anglais, Interprétation de conférence & Écriture')
  const heroCtaText = getSetting('hero_cta_text', language) || (language === 'en' ? 'Start Improving Your Communication Today' : 'Commencez à améliorer votre communication dès aujourd\'hui')
  const heroCtaLink = getSetting('hero_cta_link') || '/contact'
  const ctaImageUrl = getSetting('cta_image_url') || '/images/cta-image.jpg'

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        setLoading(true)
        // Charger toutes les données en parallèle
        const [refsEn, refsFr, postsEn, servicesData, pageData] = await Promise.all([
          fetchReferences('en', true),
          fetchReferences('fr', true),
          fetchBlogPosts('en', 2),
          fetchServices(language, true),
          fetchPage('home', language).catch(() => null) // Si la page n'existe pas, on utilise le fallback
        ])

        if (cancelled) return

        // Combiner les références EN et FR featured, prendre les 6 premières
        const allFeaturedRefs = [...refsEn, ...refsFr].slice(0, 6)
        setFeaturedReferences(allFeaturedRefs)
        setRecentPosts(postsEn)
        // Prendre les services pour le carousel (limiter à 4)
        setServices(servicesData.slice(0, 4))
        setHomePage(pageData)
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading home data:', error)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadData()

    return () => {
      cancelled = true
    }
  }, [language])

  // Auto-rotate testimonials every 5 seconds with fade effect
  useEffect(() => {
    const refsCount = featuredReferences.length
    if (refsCount <= 1) return

    const interval = setInterval(() => {
      setTestimonialFading(true)

      setTimeout(() => {
        setCurrentTestimonialIndex(prevIndex => {
          let newIndex
          do {
            newIndex = Math.floor(Math.random() * refsCount)
          } while (newIndex === prevIndex && refsCount > 1)
          return newIndex
        })
        setTestimonialFading(false)
      }, 500) // Duration of fade out
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredReferences])

  // Reset index if it becomes out of bounds
  useEffect(() => {
    if (featuredReferences.length > 0 && currentTestimonialIndex >= featuredReferences.length) {
      setCurrentTestimonialIndex(0)
    }
  }, [featuredReferences.length, currentTestimonialIndex])

  // Le hero utilise toujours les settings dynamiques
  // Ne pas utiliser homePage?.content pour le hero, seulement pour d'autres sections si nécessaire

  const getCTAContent = () => {
    if (homePage?.content) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(homePage.content, 'text/html')
      const ctaContent = doc.querySelector('.cta-section-content')
      if (ctaContent) {
        return ctaContent.innerHTML
      }
    }
    return null
  }

  const ctaContent = getCTAContent()

  if (loading) {
    return (
      <div className="home">
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{homePage?.meta_title || getSetting('seo_default_title', language) || 'Katy Murr - English Coaching, Interpreting & Writing Services'}</title>
        <meta name="description" content={homePage?.meta_description || getSetting('seo_default_description', language) || 'Professional English coaching, conference interpreting, and writing services. Fiction and non-fiction writing expertise.'} />
        <meta name="keywords" content={getSetting('seo_default_keywords', language) || 'english coaching, conference interpreting, writing services, fiction writing, non-fiction writing, language learning'} />
        <link rel="canonical" href="https://katymurr.com/" />
        {/* Open Graph */}
        <meta property="og:title" content={homePage?.meta_title || getSetting('seo_default_title', language) || 'Katy Murr - English Coaching, Interpreting & Writing Services'} />
        <meta property="og:description" content={homePage?.meta_description || getSetting('seo_default_description', language) || 'Professional English coaching, conference interpreting, and writing services.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://katymurr.com/" />
        <meta property="og:image" content={heroImageUrl.startsWith('http') ? heroImageUrl : `https://katymurr.com${heroImageUrl}`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homePage?.meta_title || getSetting('seo_default_title', language) || 'Katy Murr - English Coaching, Interpreting & Writing Services'} />
        <meta name="twitter:description" content={homePage?.meta_description || getSetting('seo_default_description', language) || 'Professional English coaching, conference interpreting, and writing services.'} />
        <meta name="twitter:image" content={heroImageUrl.startsWith('http') ? heroImageUrl : `https://katymurr.com${heroImageUrl}`} />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <GlobalSchema />
      <SEO
        title={homePage?.meta_title || 'Katy Murr'}
        description={homePage?.meta_description || 'Professional English coaching, conference interpreting, and writing services.'}
        image={heroImageUrl}
        type="website"
      />

      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-background">
            {heroMediaType === 'video' && heroVideoUrl ? (
              <video
                key={heroVideoUrl}
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                src={heroVideoUrl}
                aria-label="Hero background video"
              >
                {/* Fallback image si la vidéo ne peut pas être chargée */}
                <img src={heroImageUrl} alt="Katy Murr" className="hero-image" />
              </video>
            ) : (
              <img src={heroImageUrl} alt="Katy Murr" className="hero-image" />
            )}
            <div className="hero-overlay"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              {/* Hero content toujours dynamique depuis les settings */}
              <h1 className="hero-title">{heroTitle}</h1>
              <h2 className="hero-tagline">{heroSubtitle}</h2>
              <div className="hero-actions">
                <Link to={heroCtaLink} className="btn btn-primary">
                  {heroCtaText} <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <section className="section about-preview">
            <div className="container">
              <div className="about-preview-grid">
                <div className="about-preview-image">
                  <img
                    src="/images/about-portrait.png"
                    alt={language === 'en' ? 'Portrait of Katy Murr' : 'Portrait de Katy Murr'}
                  />
                </div>
                <div className="about-preview-content">
                  <h2 className="section-title text-left">
                    {language === 'en' ? 'About Me' : 'À propos de moi'}
                  </h2>
                  <p className="lead-text">
                    {language === 'en'
                      ? 'Your message matters.'
                      : 'Votre message compte.'
                    }
                  </p>
                  <p>
                    {language === 'en'
                      ? 'I help business leaders communicate with clarity, confidence, and impact, drawing on over a decade of experience in international conference interpreting and executive English coaching.'
                      : 'J\'aide les dirigeants d\'entreprise à communiquer avec clarté, confiance et impact, en m\'appuyant sur plus d\'une décennie d\'expérience en interprétation pour des conférences internationales et en coaching d\'anglais pour cadres.'
                    }
                  </p>
                  <Link to="/about" className="btn btn-secondary mt-md">
                    {language === 'en' ? 'Learn More About My Journey' : 'En savoir plus sur mon parcours'} <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Services Preview */}
        {services.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <section className="section services-preview">
              <div className="container">
                <h2 className="section-title">
                  {language === 'en' ? 'Services' : 'Services'}
                </h2>
                <div className="services-carousel-wrapper">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                      480: {
                        slidesPerView: 1.2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                      },
                    }}
                    navigation={false}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    loop={services.length > 2}
                    grabCursor={true}
                    className="services-swiper"
                  >
                    {services.map((service, index) => (
                      <SwiperSlide key={service.id}>
                        <div className="service-card">
                          <span className="service-number">{(index + 1).toString().padStart(2, '0')}</span>
                          <h3>{service.title}</h3>
                          <p>
                            {service.description || service.subtitle || ''}
                          </p>
                          <Link to={`/services/${service.slug}`} className="service-link">
                            {language === 'en' ? 'Learn more' : 'En savoir plus'} <i className="fas fa-arrow-right"></i>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Featured References */}
        {featuredReferences.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <section className="section references-preview">
              <div className="container">
                <h2 className="section-title">
                  {language === 'en' ? 'What Clients Say' : 'Témoignages'}
                </h2>
                <div className="testimonial-carousel">
                  <div
                    key={featuredReferences[currentTestimonialIndex]?.id || currentTestimonialIndex}
                    className={`testimonial-item ${testimonialFading ? 'fading' : ''}`}
                  >
                    {featuredReferences[currentTestimonialIndex] && (
                      <ReferenceCard
                        id={featuredReferences[currentTestimonialIndex].id}
                        name={featuredReferences[currentTestimonialIndex].name}
                        position={featuredReferences[currentTestimonialIndex].position}
                        institution={featuredReferences[currentTestimonialIndex].institution}
                        institution_logo={featuredReferences[currentTestimonialIndex].institution_logo}
                        testimonial={featuredReferences[currentTestimonialIndex].testimonial}
                        maxLength={300}
                        language={language}
                      />
                    )}
                  </div>
                  <div className="testimonial-dots">
                    {featuredReferences.map((_, index) => (
                      <button
                        key={index}
                        className={`testimonial-dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                        onClick={() => {
                          setTestimonialFading(true)
                          setTimeout(() => {
                            setCurrentTestimonialIndex(index)
                            setTestimonialFading(false)
                          }, 500)
                        }}
                        aria-label={`Voir témoignage ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center mt-md">
                  <Link to="/references" className="btn btn-secondary">
                    <i className="fas fa-quote-left" style={{ marginRight: '8px' }}></i>
                    {language === 'en' ? 'View All References' : 'Voir toutes les références'}
                  </Link>
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Logo Carousel - Client Logos */}
        <AnimatedSection animation="fadeInUp" delay={0.25}>
          <LogoCarousel />
        </AnimatedSection>

        {/* Recent Blog Posts */}
        {recentPosts.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <section className="section blog-preview">
              <div className="container">
                <h2 className="section-title">
                  {language === 'en' ? 'Latest from the Blog' : 'Derniers articles'}
                </h2>
                <div className="blog-grid">
                  {recentPosts.map((post) => (
                    <article key={post.id} className="blog-card">
                      {post.featured_image && (
                        <div className="blog-card-image">
                          <img src={post.featured_image} alt={post.title} />
                        </div>
                      )}
                      <div className="blog-card-content">
                        <h3>{post.title}</h3>
                        {post.excerpt && <p>{post.excerpt}</p>}
                        <Link to={`/blog/${post.slug}`} className="blog-link">
                          {language === 'en' ? 'Read more' : 'Lire la suite'} <i className="fas fa-arrow-right" style={{ fontSize: '0.8em' }}></i>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="text-center mt-md">
                  <Link to="/blog" className="btn btn-secondary">
                    <i className="fas fa-newspaper" style={{ marginRight: '8px' }}></i>
                    {language === 'en' ? 'View All Posts' : 'Voir tous les articles'}
                  </Link>
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* CTA Section */}
        <AnimatedSection animation="fadeInUp" delay={0.4}>
          <section className="section cta-section">
            <div
              className="cta-background"
              style={{ backgroundImage: `url(${ctaImageUrl})` }}
            >
              <div className="cta-overlay"></div>
            </div>
            <div className="container">
              <div className="cta-content">
                {ctaContent ? (
                  <div
                    className="cta-section-content"
                    dangerouslySetInnerHTML={{ __html: ctaContent }}
                  />
                ) : (
                  <>
                    <h2>
                      {language === 'en'
                        ? 'Ready to communicate with confidence and influence?'
                        : 'Prêt à communiquer avec confiance et influence ?'
                      }
                    </h2>
                    <p>
                      {language === 'en'
                        ? 'Get in touch to discuss your project and start making an impact.'
                        : 'Contactez-nous pour discuter de votre projet et commencer à avoir un impact.'
                      }
                    </p>
                    <div className="cta-actions">
                      <Link to="/contact" className="btn btn-primary">
                        <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                        {language === 'en' ? 'Get in Touch' : 'Contactez-nous'}
                      </Link>
                      <Link to="/services" className="btn btn-secondary">
                        <i className="fas fa-th-list" style={{ marginRight: '8px' }}></i>
                        {language === 'en' ? 'View Services' : 'Voir les services'}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </>
  )
}

export default Home

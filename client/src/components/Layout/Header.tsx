import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSiteSettings } from '../SiteSettings/SiteSettingsProvider'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { fetchMenu } from '../../services/api'
import { HiChevronDown } from 'react-icons/hi'
import './Header.css'

interface MenuItem {
  id: string
  label_en: string
  label_fr: string
  url?: string
  type: 'link' | 'dropdown' | 'service'
  parent_id?: string
  order_index: number
  language: string
  visible: boolean
  icon?: string
}

function Header() {
  const { t, language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loadingMenu, setLoadingMenu] = useState(true)

  // Détecter si on est sur la page d'accueil
  const isHomePage = location.pathname === '/' || location.pathname === ''

  const logoUrl = getSetting('logo_url') || '/logo.png'
  const siteName = getSetting('site_name') || 'Katy Murr'
  const contactEmail = getSetting('contact_email') || 'contact@katymurr.com'
  const contactPhone = getSetting('contact_phone') || '+41 79 658 56 71'
  const linkedinUrl = getSetting('social_linkedin') || 'https://www.linkedin.com/in/katymurr'
  const linkedinAriaLabel = language === 'en' ? 'Visit our LinkedIn page' : 'Voir notre page LinkedIn'

  useEffect(() => {
    let ticking = false

    // Seuils avec hystérésis pour éviter le saccadage
    const SCROLL_DOWN_THRESHOLD = 80  // Déclencher après 80px de scroll vers le bas
    const SCROLL_UP_THRESHOLD = 40    // Revenir à l'état initial si on remonte au-dessus de 40px

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY

          // Hystérésis : seuils différents pour éviter le basculement rapide
          if (!isScrolled && scrollPosition > SCROLL_DOWN_THRESHOLD) {
            setIsScrolled(true)
          } else if (isScrolled && scrollPosition < SCROLL_UP_THRESHOLD) {
            setIsScrolled(false)
          }

          ticking = false
        })
        ticking = true
      }
    }

    // Vérifier l'état initial au chargement
    setIsScrolled(window.scrollY > SCROLL_DOWN_THRESHOLD)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled])

  // Load menu from API
  useEffect(() => {
    let cancelled = false

    const loadMenu = async () => {
      try {
        setLoadingMenu(true)
        const items = await fetchMenu(language)
        if (cancelled) return
        setMenuItems(items || [])
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading menu:', error)
          // Fallback to default menu if API fails
          setMenuItems([])
        }
      } finally {
        if (!cancelled) {
          setLoadingMenu(false)
        }
      }
    }
    loadMenu()

    return () => {
      cancelled = true
    }
  }, [language])

  // Render menu items dynamically
  const renderMenuItems = () => {
    if (loadingMenu) {
      return (
        <>
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/services" className="nav-link">{t('nav.services')}</Link>
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
          <Link to="/references" className="nav-link">{t('nav.references')}</Link>
          <Link to="/blog" className="nav-link">{t('nav.blog')}</Link>
          <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
        </>
      )
    }

    if (menuItems.length === 0) {
      // Fallback to default menu with services dropdown
      const isServicesDropdownOpen = openDropdownId === 'services-fallback'

      return (
        <>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('nav.home')}
          </Link>

          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenDropdownId('services-fallback')}
            onMouseLeave={() => setOpenDropdownId(null)}
          >
            <button
              className="nav-link nav-dropdown-toggle"
              onMouseEnter={() => setOpenDropdownId('services-fallback')}
              onClick={(e) => {
                e.preventDefault()
                setOpenDropdownId(isServicesDropdownOpen ? null : 'services-fallback')
              }}
            >
              {t('nav.services')} <HiChevronDown className="dropdown-icon" />
            </button>
            {isServicesDropdownOpen && (
              <div
                className="nav-dropdown-menu"
                onMouseEnter={() => setOpenDropdownId('services-fallback')}
                onMouseLeave={() => setOpenDropdownId(null)}
              >
                <Link to="/services/english-coaching" onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}>
                  <span className="dropdown-number">01</span>
                  {t('services.english-coaching')}
                </Link>
                <Link to="/services/conference-interpreting" onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}>
                  <span className="dropdown-number">02</span>
                  {t('services.interpreting')}
                </Link>
                <Link to="/services/creative-solutions" onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}>
                  <span className="dropdown-number">03</span>
                  {language === 'en' ? 'Creative Solutions' : 'Solutions créatives'}
                </Link>
                <Link to="/services/translation-proofreading" onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}>
                  <span className="dropdown-number">04</span>
                  {language === 'en' ? 'Translation & Proofreading' : 'Traduction & Correction'}
                </Link>
                <Link to="/services/writing" onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}>
                  <span className="dropdown-number">05</span>
                  {language === 'en' ? 'Writing' : 'Écriture'}
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('nav.about')}
          </Link>
          <Link to="/references" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('nav.references')}
          </Link>
          <Link to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('nav.blog')}
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('nav.contact')}
          </Link>
        </>
      )
    }

    // Render dynamic menu
    const topLevelItems = menuItems.filter(item => !item.parent_id && item.visible)

    return topLevelItems.map((item) => {
      const label = language === 'en' ? item.label_en : item.label_fr

      if (item.type === 'dropdown' || item.type === 'service') {
        const childItems = menuItems.filter(child => child.parent_id === item.id && child.visible)
        const isOpen = openDropdownId === item.id

        return (
          <div
            key={item.id}
            className="nav-dropdown"
            onMouseEnter={() => setOpenDropdownId(item.id)}
            onMouseLeave={() => setOpenDropdownId(null)}
          >
            <button
              className="nav-link nav-dropdown-toggle"
              onMouseEnter={() => setOpenDropdownId(item.id)}
              onClick={(e) => {
                e.preventDefault()
                setOpenDropdownId(isOpen ? null : item.id)
              }}
            >
              {label} <HiChevronDown className="dropdown-icon" />
            </button>
            {isOpen && childItems.length > 0 && (
              <div
                className="nav-dropdown-menu"
                onMouseEnter={() => setOpenDropdownId(item.id)}
                onMouseLeave={() => setOpenDropdownId(null)}
              >
                {childItems.map((child, index) => {
                  const childLabel = language === 'en' ? child.label_en : child.label_fr
                  const url = child.url || '#'
                  const number = (index + 1).toString().padStart(2, '0')

                  if (url.startsWith('http')) {
                    return (
                      <a
                        key={child.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}
                      >
                        <span className="dropdown-number">{number}</span>
                        {childLabel}
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={child.id}
                      to={url}
                      onClick={() => { setIsMenuOpen(false); setOpenDropdownId(null); }}
                    >
                      <span className="dropdown-number">{number}</span>
                      {childLabel}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      }

      const url = item.url || '#'

      if (url.startsWith('http')) {
        return (
          <a
            key={item.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {label}
          </a>
        )
      }

      return (
        <Link
          key={item.id}
          to={url}
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          {label}
        </Link>
      )
    })
  }

  const navLinks = <>{renderMenuItems()}</>

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''} ${isHomePage ? 'header-home' : ''}`}>
      <div className="container">
        {/* État initial : Logo centré en haut, menu en dessous (desktop uniquement) */}
        <div className={`header-content header-content-top ${isScrolled ? 'header-content-hidden' : ''}`}>
          <div className="header-top">
            <Link to="/" className="logo logo-centered logo-with-tagline">
              <img src={logoUrl} alt={siteName} className="logo-image" />
              <span className="logo-tagline">Conference Interpreter &amp; Executive English Coach</span>
            </Link>
            <button
              className="menu-toggle menu-toggle-top"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="nav-wrapper-top">
            <nav className={`nav nav-centered ${isMenuOpen ? 'nav-open' : ''}`}>
              {navLinks}
            </nav>
            <div className="header-actions-top">
              <a href={`tel:${contactPhone}`} className="contact-btn" aria-label="Call us">
                <i className="fas fa-phone"></i>
              </a>
              <a href={`mailto:${contactEmail}`} className="contact-btn" aria-label="Email us">
                <i className="fas fa-envelope"></i>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                aria-label={linkedinAriaLabel}
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <LanguageSelector />
            </div>
          </div>
          {/* Layout mobile - toujours visible mais masqué sur desktop */}
          <div className="header-mobile">
            <Link to="/" className="logo logo-mobile logo-with-tagline">
              <img src={logoUrl} alt={siteName} className="logo-image" />
              <span className="logo-tagline">Conference Interpreter &amp; Executive English Coach</span>
            </Link>
            <nav className={`nav nav-mobile ${isMenuOpen ? 'nav-open' : ''}`}>
              {navLinks}
              <div className="mobile-language-selector">
                <LanguageSelector />
              </div>
            </nav>
            <div className="header-actions header-actions-mobile">
              <a href={`tel:${contactPhone}`} className="contact-btn" aria-label="Call us">
                <i className="fas fa-phone"></i>
              </a>
              <a href={`mailto:${contactEmail}`} className="contact-btn" aria-label="Email us">
                <i className="fas fa-envelope"></i>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                aria-label={linkedinAriaLabel}
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <div className="desktop-language-selector">
                <LanguageSelector />
              </div>
              <button
                className="menu-toggle menu-toggle-mobile"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        {/* État scrollé : Logo à gauche, menu au milieu, langue à droite */}
        <div className={`header-content header-content-scrolled ${!isScrolled ? 'header-content-hidden' : ''}`}>
          <Link to="/" className="logo">
            <img src={logoUrl} alt={siteName} className="logo-image" />
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            {navLinks}
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
          </nav>

          <div className="header-actions">
            <a href={`tel:${contactPhone}`} className="contact-btn" aria-label="Call us">
              <i className="fas fa-phone"></i>
            </a>
            <a href={`mailto:${contactEmail}`} className="contact-btn" aria-label="Email us">
              <i className="fas fa-envelope"></i>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
              aria-label={linkedinAriaLabel}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <div className="desktop-language-selector">
              <LanguageSelector />
            </div>
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

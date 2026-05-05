import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSiteSettings } from '../SiteSettings/SiteSettingsProvider'
import './Footer.css'

function Footer() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [showScrollTop, setShowScrollTop] = useState(false)

  const siteName = getSetting('site_name') || 'Katy Murr'
  const contactEmail = getSetting('contact_email') || 'contact@katymurr.com'
  const contactPhone = getSetting('contact_phone') || '+41 79 658 56 71'
  const companyNumber = getSetting('company_number') || 'CHE-365.506.039'
  const linkedinUrl = getSetting('social_linkedin') || 'https://www.linkedin.com/in/katymurr'
  const copyrightText = getSetting('footer_copyright_text') || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setShowScrollTop(scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-social">
            <a
              className="footer-linkedin-button"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={language === 'en' ? 'Visit our LinkedIn page' : 'Voir notre page LinkedIn'}
            >
              <i className="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="footer-info">
            <p className="footer-contact">
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>
                <i className="fas fa-phone"></i> {contactPhone}
              </a>
              <span className="separator">|</span>
              <a href={`mailto:${contactEmail}`}>
                <i className="fas fa-envelope"></i> {contactEmail}
              </a>
            </p>
            <p className="footer-copyright">
              {copyrightText}
              {companyNumber && <span> | {companyNumber}</span>}
            </p>
          </div>

          <div className="footer-links">
            <Link to="/privacy-policy">
              {language === 'en' ? 'Privacy' : 'Confidentialité'}
            </Link>
            <Link to="/terms-of-service">
              {language === 'en' ? 'Terms' : 'CGU'}
            </Link>
            <Link to="/legal-notice">
              {language === 'en' ? 'Legal' : 'Légal'}
            </Link>
            <Link to="/cookie-policy">
              {language === 'en' ? 'Cookies' : 'Cookies'}
            </Link>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label={language === 'en' ? 'Scroll to top' : 'Retour en haut'}
          title={language === 'en' ? 'Scroll to top' : 'Retour en haut'}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </footer>
  )
}

export default Footer


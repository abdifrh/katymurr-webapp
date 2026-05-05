import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { useSiteSettings } from '../components/SiteSettings/SiteSettingsProvider'
import { submitContactForm } from '../services/api'
import AnimatedSection from '../components/AnimatedSection/AnimatedSection'
import { SEO, BreadcrumbSchema, LocalBusinessSchema } from '../components/SEO/SEO'
import './Contact.css'

function Contact() {
  const { language } = useLanguage()
  const { getSetting } = useSiteSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  const contactEmail = getSetting('contact_email') || 'contact@katymurr.com'
  const contactPhone = getSetting('contact_phone') || '+41 79 658 56 71'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        service_type: formData.subject || undefined
      })
      
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error: any) {
      console.error('Error submitting contact form:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Page Contact avec formulaire toujours visible
  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact - Katy Murr</title>
        <meta name="description" content={language === 'en'
          ? 'Get in touch with Katy Murr for English coaching, interpreting, or writing services.'
          : 'Contactez Katy Murr pour des services de coaching en anglais, d\'interprÃ©tation ou d\'Ã©criture.'
        } />
        <meta name="keywords" content="contact, english coaching, interpreting, writing services" />
        <link rel="canonical" href="https://katymurr.com/contact" />
        {/* Open Graph */}
        <meta property="og:title" content="Contact - Katy Murr" />
        <meta property="og:description" content={language === 'en'
          ? 'Get in touch with Katy Murr for English coaching, interpreting, or writing services.'
          : 'Contactez Katy Murr pour des services de coaching en anglais, d\'interprÃ©tation ou d\'Ã©criture.'
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://katymurr.com/contact" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact - Katy Murr" />
        <meta name="twitter:description" content={language === 'en'
          ? 'Get in touch with Katy Murr for English coaching, interpreting, or writing services.'
          : 'Contactez Katy Murr pour des services de coaching en anglais, d\'interprÃ©tation ou d\'Ã©criture.'
        } />
      </Helmet>

      {/* SEO Enhancements */}
      <SEO
        title="Contact - Katy Murr"
        description={language === 'en'
          ? 'Get in touch with Katy Murr for English coaching, interpreting, or writing services.'
          : 'Contactez Katy Murr pour des services de coaching en anglais, d\'interprÃ©tation ou d\'Ã©criture.'
        }
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: language === 'en' ? 'Home' : 'Accueil', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
      <LocalBusinessSchema />

      <AnimatedSection animation="fadeInUp">
        <section className="section page-header">
          <div className="container">
            <h1>{language === 'en' ? 'Contact' : 'Contact'}</h1>
          <p className="page-intro">
            {language === 'en'
              ? 'Discuss your project, explore collaboration, or learn how I can help you communicate with impact.'
              : 'Discutez de votre projet, explorez une collaboration ou découvrez comment je peux vous aider à communiquer avec impact.'
            }
          </p>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.1}>
        <section className="section contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{language === 'en' ? 'Get in Touch' : 'Contactez-moi'}</h2>
              <p>
                {language === 'en'
                  ? 'I typically respond within 24-48 hours. Reach me via:'
                  : 'Je réponds généralement sous 24-48 heures. Vous pouvez me joindre via :'
                }
              </p>

              <div className="contact-details">
                {contactPhone && (
                  <div className="contact-item">
                    <strong>{language === 'en' ? 'Phone:' : 'Téléphone :'}</strong>
                    <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>{contactPhone}</a>
                  </div>
                )}
                {contactEmail && (
                  <div className="contact-item">
                    <strong>{language === 'en' ? 'Email:' : 'E-mail :'}</strong>
                    <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  </div>
                )}
              </div>
            </div>

            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  {language === 'en' ? 'Name' : 'Nom'} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {language === 'en' ? 'Email' : 'Email'} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  {language === 'en' ? 'Subject' : 'Sujet'} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {language === 'en' ? 'Select a service' : 'SÃ©lectionnez un service'}
                  </option>
                  <option value="english-coaching">
                    {language === 'en' ? 'English Coaching' : 'Coaching en anglais'}
                  </option>
                  <option value="interpreting">
                    {language === 'en' ? 'Conference Interpreting' : 'InterprÃ©tation de confÃ©rence'}
                  </option>
                  <option value="writing-fiction">
                    {language === 'en' ? 'Writing - Fiction' : 'Ã‰criture - Fiction'}
                  </option>
                  <option value="writing-nonfiction">
                    {language === 'en' ? 'Writing - Non-fiction' : 'Ã‰criture - Non-fiction'}
                  </option>
                  <option value="other">
                    {language === 'en' ? 'Other' : 'Autre'}
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  {language === 'en' ? 'Message' : 'Message'} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              {status === 'success' && (
                <div className="form-message success">
                  {language === 'en'
                    ? 'Thank you! Your message has been sent successfully.'
                    : 'Merci ! Votre message a Ã©tÃ© envoyÃ© avec succÃ¨s.'
                  }
                </div>
              )}

              {status === 'error' && (
                <div className="form-message error">
                  {language === 'en'
                    ? 'Sorry, there was an error sending your message. Please try again.'
                    : 'DÃ©solÃ©, une erreur s\'est produite lors de l\'envoi de votre message. Veuillez rÃ©essayer.'
                  }
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
              >
                {status === 'sending'
                  ? (language === 'en' ? 'Sending...' : 'Envoi...')
                  : (language === 'en' ? 'Send Message' : 'Envoyer le message')
                }
              </button>
            </form>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  )
}

export default Contact



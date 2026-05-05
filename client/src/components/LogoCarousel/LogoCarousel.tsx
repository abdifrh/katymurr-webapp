import { useEffect, useState } from 'react'
import { fetchClientLogos } from '../../services/api'
import './LogoCarousel.css'

interface ClientLogo {
  id: string
  name: string
  logo_url: string
  alt_text?: string
  website_url?: string
}

function LogoCarousel() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const data = await fetchClientLogos()
        setLogos(data)
      } catch (error) {
        console.error('Error loading client logos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLogos()
  }, [])

  if (loading || logos.length === 0) {
    return null
  }

  return (
    <section className="logo-carousel-section">
      <div className="container">
        {/*<h2 className="section-title">
           {language === 'en' ? 'Trusted by Leading Organizations' : 'Reconnue par les plus grandes organisations'}
        </h2> */}
        <div className="logo-carousel-wrapper">
          <div className="logo-carousel-track">
            {/* Dupliquer les logos pour créer l'effet infini */}
            {[...logos, ...logos].map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="logo-item">
                {logo.website_url ? (
                  <a href={logo.website_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={logo.logo_url}
                      alt={logo.alt_text || logo.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </a>
                ) : (
                  <img
                    src={logo.logo_url}
                    alt={logo.alt_text || logo.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LogoCarousel

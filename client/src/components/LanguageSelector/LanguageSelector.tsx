import { useLanguage } from '../../contexts/LanguageContext'
import './LanguageSelector.css'

function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-selector">
      <i className="fas fa-globe lang-icon"></i>
      <div className="lang-options">
        <button
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
          aria-label="English"
        >
          EN
        </button>
        <span className="lang-separator">|</span>
        <button
          className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
          onClick={() => setLanguage('fr')}
          aria-label="Français"
        >
          FR
        </button>
      </div>
    </div>
  )
}

export default LanguageSelector


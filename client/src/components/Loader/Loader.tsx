import { useLanguage } from '../../contexts/LanguageContext'
import './Loader.css'

interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

function Loader({ size = 'medium', text, fullScreen = false }: LoaderProps) {
  const { language } = useLanguage()
  const displayText = text || (language === 'en' ? 'Loading...' : 'Chargement...')

  const loader = (
    <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className="loader-wrapper">
        <div className={`loader-spinner loader-${size}`}>
          <div className="spinner-square"></div>
          <div className="spinner-square"></div>
          <div className="spinner-square"></div>
        </div>
        <p className="loader-text">{displayText}</p>
      </div>
    </div>
  )

  return loader
}

export default Loader


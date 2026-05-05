import { useLanguage } from '../contexts/LanguageContext'
import DynamicPage from '../components/DynamicPage/DynamicPage'
import './About.css'

function About() {
  const { language } = useLanguage()

  // Contenu fallback si la page n'existe pas dans la DB
  const fallbackContent = (
    <section className="section about-content">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <img
              src="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_718/https://www.katymurr.com/wp-content/uploads/2021/01/1610547162543-718x1024.jpg"
              alt={language === 'en' ? 'Professional Photo of Katy Murr' : 'Photo professionnelle de Katy Murr'}
              className="about-photo"
            />
          </div>

          <div className="about-text">
            <h2 className="about-subtitle">{language === 'en' ? 'About Katy Murr' : 'À propos de Katy Murr'}</h2>
            <div className="about-body">
              {language === 'en' ? (
                <>
                  <p>
                    Foreign languages and maps spanning far-flung places have always inspired me. I spent my childhood in the UK working my way through my local library's collection, and my teenage years at the park reading and writing.
                  </p>
                  <p>
                    I'm eternally grateful to the BBC (BBC Blast Arts Programme), Manchester Art Gallery and The Tate (Creative Consultants), as well as the British Council (Research Fellowship) for these extraordinary opportunities that shaped my very ordinary world.
                  </p>
                  <p>
                    So much so, that after all these adventures, I crossed the channel and Switzerland became my new home. The lakes, rivers and mountains drew me in. I was a tour guide at the Castle of Gruyères, read French and English literature at the University of Lausanne, then headed off to Freie Universität Berlin to brush up on my German.
                  </p>
                  <p>
                    Next, the 6th floor of the Uni-Mail building and the nearby swimming pool became my new homes while I studied for my Masters in Conference Interpreting at the University of Geneva.
                  </p>
                  <p>
                    Since my MA, I've covered conferences in The Hague, in a tiny village in Switzerland called Evolène and, closer to home, at the many international organisations in Geneva. I've rediscovered the joy of teaching, which, like interpreting, is another conversation of sorts. I also continue to put pen to paper, for personal projects and commissioned work.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Les langues étrangères et les cartes couvrant des lieux lointains m'ont toujours inspirée. J'ai passé mon enfance au Royaume-Uni à parcourir la collection de ma bibliothèque locale, et mes années d'adolescence au parc à lire et à écrire.
                  </p>
                  <p>
                    Je suis éternellement reconnaissante à la BBC (BBC Blast Arts Programme), à la Manchester Art Gallery et à The Tate (Creative Consultants), ainsi qu'au British Council (Research Fellowship) pour ces opportunités extraordinaires qui ont façonné mon monde très ordinaire.
                  </p>
                  <p>
                    À tel point qu'après toutes ces aventures, j'ai traversé la Manche et la Suisse est devenue ma nouvelle maison. Les lacs, les rivières et les montagnes m'ont attirée. J'ai été guide touristique au Château de Gruyères, j'ai étudié la littérature française et anglaise à l'Université de Lausanne, puis je suis partie à la Freie Universität Berlin pour améliorer mon allemand.
                  </p>
                  <p>
                    Ensuite, le 6ème étage du bâtiment Uni-Mail et la piscine voisine sont devenus mes nouveaux foyers pendant que j'étudiais pour mon Master en Interprétation de Conférence à l'Université de Genève.
                  </p>
                  <p>
                    Depuis mon Master, j'ai couvert des conférences à La Haye, dans un petit village suisse appelé Evolène et, plus près de chez moi, dans les nombreuses organisations internationales de Genève. J'ai redécouvert la joie d'enseigner, qui, comme l'interprétation, est une autre forme de conversation. Je continue également à mettre la plume au papier, pour des projets personnels et des travaux commandés.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const aboutCta = (
    <section className="section about-cta">
      <div className="container">
        <div className="about-cta-content">
          <p className="about-cta-text">
            {language === 'en' ? (
              <>
                Ready to communicate with clarity, confidence, and impact?
                <br />
                Let&apos;s start the conversation.
              </>
            ) : (
              <>
                Prêt à communiquer avec clarté, confiance et impact ?
                <br />
                Commençons la conversation.
              </>
            )}
          </p>
          <div className="about-cta-buttons">
            <a href="/contact" className="btn btn-primary">
              <i className="fas fa-paper-plane cta-contact-icon" aria-hidden="true"></i>
              {language === 'en' ? 'Get in Touch' : 'Contactez-nous'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <>
      <DynamicPage
        slug="about"
        fallbackTitle={language === 'en' ? 'About' : 'À propos'}
        fallbackContent={fallbackContent}
        fallbackMetaDescription={language === 'en'
          ? 'Learn more about Katy Murr, professional English coach, interpreter, and writer.'
          : 'Découvrez Katy Murr, coach en anglais, interprète de conférence et écrivaine professionnelle.'
        }
        className="about-page"
      />
      {aboutCta}
    </>
  )
}

export default About

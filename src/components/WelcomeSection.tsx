import { useTranslation } from "react-i18next";

interface WelcomeSectionProps {
  onNavigate: (sectionId: string) => void;
}

function WelcomeSection({ onNavigate }: WelcomeSectionProps) {
  const { t } = useTranslation();
  const apartmentNumber = import.meta.env.VITE_APARTMENT_NUMBER || "";
  const fullAddress = t('propertyInfo.address').replace(
    "{{APARTMENT_NUMBER}}",
    apartmentNumber,
  );

  const introMessages = t('welcome.introMessages', { returnObjects: true }) as string[];
  const features = t('welcome.featuresSection.features', { returnObjects: true }) as Array<{text: string; link?: string}>;
  const featureIcons = ['wifi', 'door_front', 'restaurant', 'map', 'phone', 'sentiment_satisfied'];
  const addToPhoneMessages = t('welcome.addToPhone.messages', { returnObjects: true }) as string[];
  const teamMembers = t('welcome.meetYourTeam.hostWelcome.teamMembers', { returnObjects: true }) as Array<{text: string}>;
  const teamMemberIcons = ['support_agent', 'home_repair_service', 'cleaning_services'];

  return (
    <div className="section-content">
      <div className="welcome-header">
        <h1>{t('propertyInfo.name')}</h1>
        <p className="address">
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>
            location_on
          </span>
          {fullAddress}
        </p>
      </div>

      <div className="welcome-intro">
        {introMessages.map((message, index) => (
          <p key={index} className="welcome-message">
            {message}
          </p>
        ))}
      </div>

      <div className="welcome-features">
        <h3>{t('welcome.featuresSection.title')}</h3>
        <p><strong>{t('welcome.featuresSection.answer')}</strong></p>
        <p>{t('welcome.featuresSection.description')}</p>
        <ul className="features-list">
          {features.map((feature, index) => (
            <li 
              key={index}
              className={feature.link ? 'clickable' : ''}
              onClick={() => feature.link && onNavigate(feature.link)}
            >
              <span className="material-symbols-outlined feature-icon">
                {featureIcons[index] || 'info'}
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
        <p className="happiness-note">
          {t('welcome.featuresSection.note')}
        </p>
      </div>

      <div className="add-to-phone">
        <h3>
          <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
            phone_iphone
          </span>
          {t('welcome.addToPhone.title')}
        </h3>
        {addToPhoneMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <div className="meet-your-team">
        <h2>{t('welcome.meetYourTeam.title')}</h2>
        
        <div className="host-welcome">
          <h3>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              waving_hand
            </span>
            {t('welcome.meetYourTeam.hostWelcome.title')}
          </h3>
          <p>{t('welcome.meetYourTeam.hostWelcome.description')}</p>
          <p>{t('welcome.meetYourTeam.hostWelcome.teamIntro')}</p>
          <ul className="team-list">
            {teamMembers.map((member, index) => (
              <li key={index}>
                <span className="material-symbols-outlined team-icon">
                  {teamMemberIcons[index] || 'person'}
                </span>
                {member.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="founder-note">
          <h3>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              person
            </span>
            {t('welcome.meetYourTeam.founderNote.title')}
          </h3>
          <p className="founder-message">
            {t('welcome.meetYourTeam.founderNote.message').split('\n').map((line, index, arr) => (
              <span key={index}>
                {line}
                {index < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="mission-statement">
            {t('welcome.meetYourTeam.founderNote.mission').split('\n').map((line, index, arr) => (
              <span key={index}>
                {line}
                {index < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p>{t('welcome.meetYourTeam.founderNote.closing')}</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;

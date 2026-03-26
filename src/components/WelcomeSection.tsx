import type { PropertyInfo, Welcome } from "../types";

interface WelcomeSectionProps {
  propertyInfo: PropertyInfo;
  welcomeData: Welcome;
  onNavigate: (sectionId: string) => void;
}

function WelcomeSection({ propertyInfo, welcomeData, onNavigate }: WelcomeSectionProps) {
  const apartmentNumber = import.meta.env.VITE_APARTMENT_NUMBER || "";
  const fullAddress = propertyInfo.address.replace(
    "{{APARTMENT_NUMBER}}",
    apartmentNumber,
  );

  return (
    <div className="section-content">
      <div className="welcome-header">
        <h1>{propertyInfo.name}</h1>
        <p className="address">
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>
            location_on
          </span>
          {fullAddress}
        </p>
      </div>

      <div className="welcome-intro">
        {welcomeData.introMessages.map((message, index) => (
          <p key={index} className="welcome-message">
            {message}
          </p>
        ))}
      </div>

      <div className="welcome-features">
        <h3>{welcomeData.featuresSection.title}</h3>
        <p><strong>{welcomeData.featuresSection.answer}</strong></p>
        <p>{welcomeData.featuresSection.description}</p>
        <ul className="features-list">
          {welcomeData.featuresSection.features.map((feature, index) => (
            <li 
              key={index}
              className={feature.link ? 'clickable' : ''}
              onClick={() => feature.link && onNavigate(feature.link)}
            >
              <span className="material-symbols-outlined feature-icon">
                {feature.icon}
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
        <p className="happiness-note">
          {welcomeData.featuresSection.note}
        </p>
      </div>

      <div className="add-to-phone">
        <h3>
          <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
            {welcomeData.addToPhone.icon}
          </span>
          {welcomeData.addToPhone.title}
        </h3>
        {welcomeData.addToPhone.messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <div className="meet-your-team">
        <h2>{welcomeData.meetYourTeam.title}</h2>
        
        <div className="host-welcome">
          <h3>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              {welcomeData.meetYourTeam.hostWelcome.icon}
            </span>
            {welcomeData.meetYourTeam.hostWelcome.title}
          </h3>
          <p>{welcomeData.meetYourTeam.hostWelcome.description}</p>
          <p>{welcomeData.meetYourTeam.hostWelcome.teamIntro}</p>
          <ul className="team-list">
            {welcomeData.meetYourTeam.hostWelcome.teamMembers.map((member, index) => (
              <li key={index}>
                <span className="material-symbols-outlined team-icon">
                  {member.icon}
                </span>
                {member.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="founder-note">
          <h3>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              {welcomeData.meetYourTeam.founderNote.icon}
            </span>
            {welcomeData.meetYourTeam.founderNote.title}
          </h3>
          <p className="founder-message">
            {welcomeData.meetYourTeam.founderNote.message.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < welcomeData.meetYourTeam.founderNote.message.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="mission-statement">
            {welcomeData.meetYourTeam.founderNote.mission.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < welcomeData.meetYourTeam.founderNote.mission.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          <p>{welcomeData.meetYourTeam.founderNote.closing}</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;

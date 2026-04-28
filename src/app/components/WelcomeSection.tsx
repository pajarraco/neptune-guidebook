import { useTranslation } from "react-i18next";

interface WelcomeSectionProps {
  onNavigate: (sectionId: string) => void;
}

function WelcomeSection({ onNavigate }: WelcomeSectionProps) {
  const { t } = useTranslation();

  const introMessages = t("welcome.introMessages", {
    returnObjects: true,
  }) as string[];
  const features = t("welcome.featuresSection.features", {
    returnObjects: true,
  }) as Array<{ text: string; link?: string }>;
  const featureIcons = [
    "wifi",
    "door_front",
    "restaurant",
    "map",
    "phone",
    "sentiment_satisfied",
  ];
  const addToPhoneMessages = t("welcome.addToPhone.messages", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="section-content">
      <h1>{t("propertyInfo.name")}</h1>

      <div className="welcome-intro">
        {introMessages.map((message, index) => (
          <p
            key={index}
            className="welcome-message"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ))}
      </div>

      <div className="welcome-features">
        <h3>{t("welcome.featuresSection.title")}</h3>
        <p>
          <strong>{t("welcome.featuresSection.answer")}</strong>
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: t("welcome.featuresSection.description"),
          }}
        />
        <ul className="features-list">
          {features.map((feature, index) => (
            <li
              key={index}
              className={feature.link ? "clickable" : ""}
              onClick={() => feature.link && onNavigate(feature.link)}
            >
              <span className="material-symbols-outlined feature-icon icon-sand">
                {featureIcons[index] || "info"}
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
        <p
          className="happiness-note"
          dangerouslySetInnerHTML={{
            __html: t("welcome.featuresSection.note"),
          }}
        />
      </div>

      <div className="add-to-phone">
        <h3>
          <span className="material-symbols-outlined icon-xl icon-inline">
            phone_iphone
          </span>
          {t("welcome.addToPhone.title")}
        </h3>
        {addToPhoneMessages.map((message, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
        ))}
      </div>

      <div className="meet-your-team">
        <h2>{t("welcome.meetYourTeam.title")}</h2>

        <div className="host-welcome">
          <h3>
            <span className="material-symbols-outlined icon-xl icon-inline icon-sand">
              waving_hand
            </span>
            {t("welcome.meetYourTeam.hostWelcome.title")}
          </h3>
          <p
            dangerouslySetInnerHTML={{
              __html: t("welcome.meetYourTeam.hostWelcome.description"),
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t("welcome.meetYourTeam.hostWelcome.teamIntro"),
            }}
          />
        </div>

        <div className="founder-note">
          <h3>
            <span className="material-symbols-outlined icon-xl icon-inline icon-sand">
              person
            </span>
            {t("welcome.meetYourTeam.founderNote.title")}
          </h3>
          <p
            className="founder-message"
            dangerouslySetInnerHTML={{
              __html: t("welcome.meetYourTeam.founderNote.message"),
            }}
          />
          <p
            className="mission-statement"
            dangerouslySetInnerHTML={{
              __html: t("welcome.meetYourTeam.founderNote.mission"),
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t("welcome.meetYourTeam.founderNote.closing"),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;

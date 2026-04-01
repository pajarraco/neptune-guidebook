import { useTranslation } from "react-i18next";

export default function EmergencySection() {
  const { t } = useTranslation();
  const contacts = t("emergency.contacts", { returnObjects: true }) as Array<{
    type: string;
    name: string;
    phone: string;
    address?: string;
    hours?: string;
    note?: string;
  }>;
  const safetyItems = t("emergency.safetyInfo.items", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="section-content">
      <h2>{t("emergency.sectionTitle")}</h2>

      <div className="emergency-alert">
        <h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.5625rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
              color: "var(--sand-color)",
            }}
          >
            emergency
          </span>
          {t("emergency.alert.title")}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: t("emergency.alert.message") }} />
      </div>

      <div className="contacts-list">
        {contacts.map((contact, index) => (
          <div key={index} className="contact-card">
            <div className="contact-type">{contact.type}</div>
            <div className="contact-name">{contact.name}</div>
            <a
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              className="contact-phone"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1.25rem",
                  verticalAlign: "middle",
                  marginRight: "0.25rem",
                  color: "var(--sand-color)",
                }}
              >
                phone
              </span>
              {contact.phone}
            </a>
            {contact.address && (
              <div
                style={{
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "1.125rem",
                    verticalAlign: "middle",
                    marginRight: "0.25rem",
                    color: "var(--sand-color)",
                  }}
                >
                  location_on
                </span>
                {contact.address}
              </div>
            )}
            {contact.hours && (
              <div
                style={{
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "1.0625rem",
                    verticalAlign: "middle",
                    marginRight: "0.25rem",
                    color: "var(--sand-color)",
                  }}
                >
                  schedule
                </span>
                {contact.hours}
              </div>
            )}
            {contact.note && (
              <div
                style={{
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                }}
              >
                {contact.note}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="safety-info">
        <h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.5625rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
              color: "var(--sand-color)",
            }}
          >
            local_fire_department
          </span>
          {t("emergency.safetyInfo.title")}
        </h3>
        <ul>
          {safetyItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="tip-box">
        <strong>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.25rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
              color: "var(--sand-color)",
            }}
          >
            location_on
          </span>
          {t("emergency.addressNote")}
        </strong>
      </div>
    </div>
  );
}

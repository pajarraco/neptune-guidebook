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
      <h1>{t("emergency.sectionTitle")}</h1>

      <div className="emergency-alert">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
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
              <span className="material-symbols-outlined icon-base icon-middle icon-mr-xs icon-sand">
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
                <span className="material-symbols-outlined icon-md icon-middle icon-mr-xs icon-sand">
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
                <span className="material-symbols-outlined icon-sm icon-middle icon-mr-xs icon-sand">
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
                dangerouslySetInnerHTML={{ __html: contact.note }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="safety-info">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
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
          <span className="material-symbols-outlined icon-base icon-inline icon-sand">
            location_on
          </span>
          {t("emergency.addressNote")}
        </strong>
      </div>
    </div>
  );
}

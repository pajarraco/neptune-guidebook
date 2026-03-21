import guidebookDataRaw from "../assets/guidebook-data.json";
import type { GuidebookData } from "../types";

const guidebookData = guidebookDataRaw as GuidebookData;

export default function EmergencySection() {
  const { emergency } = guidebookData;

  return (
    <div className="section-content">
      <h2>Emergency Contacts & Safety</h2>

      <div className="emergency-alert">
        <h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.25rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
            }}
          >
            emergency
          </span>
          {emergency.alert.title}
        </h3>
        <p dangerouslySetInnerHTML={{ __html: emergency.alert.message }} />
      </div>

      <div className="contacts-list">
        {emergency.contacts.map((contact, index) => (
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
                  fontSize: "1rem",
                  verticalAlign: "middle",
                  marginRight: "0.25rem",
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
                    fontSize: "0.9rem",
                    verticalAlign: "middle",
                    marginRight: "0.25rem",
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
                    fontSize: "0.85rem",
                    verticalAlign: "middle",
                    marginRight: "0.25rem",
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

      {emergency.safetyInfo && (
        <div className="safety-info">
          <h3>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              local_fire_department
            </span>
            {emergency.safetyInfo.title}
          </h3>
          <ul>
            {emergency.safetyInfo.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {emergency.waterSafety && (
        <div className="safety-info" style={{ marginTop: "1.5rem" }}>
          <h3>{emergency.waterSafety.title}</h3>

          <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.05rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              beach_access
            </span>
            Beaches
          </h4>
          <p>{emergency.waterSafety.beaches}</p>

          <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.05rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              water_drop
            </span>
            Freshwater Swimming
          </h4>
          <p>{emergency.waterSafety.freshwater}</p>
        </div>
      )}

      <div className="tip-box">
        <strong>
          {(() => {
            const apartmentNumber = import.meta.env.VITE_APARTMENT_NUMBER;
            if (apartmentNumber) {
              return (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "1rem",
                      verticalAlign: "middle",
                      marginRight: "0.5rem",
                    }}
                  >
                    location_on
                  </span>
                  Address for Emergency Services: Broadbeach, Unit{" "}
                  {apartmentNumber}, Gold Coast, Queensland 4218
                </>
              );
            }
            return emergency.addressNote;
          })()}
        </strong>
      </div>
    </div>
  );
}

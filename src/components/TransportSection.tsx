import { useTranslation } from "react-i18next";

export default function TransportSection() {
  const { t } = useTranslation();

  const airportOptions = t("transport.airportTransfers.options", {
    returnObjects: true,
  }) as Array<{ name: string; phone?: string; type: string }>;

  return (
    <div className="section-content">
      <h2>{t("transport.sectionTitle")}</h2>

      <div className="instruction-block">
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
            local_parking
          </span>
          {t("transport.parking.title")}
        </h3>
        <p>{t("transport.parking.description")}</p>
      </div>

      <div className="instruction-block">
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
            local_taxi
          </span>
          {t("transport.rideshare.title")}
        </h3>
        <p>{t("transport.rideshare.description")}</p>
      </div>

      <div className="instruction-block">
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
            tram
          </span>
          {t("transport.publicTransport.title")}
        </h3>
        <p>{t("transport.publicTransport.description")}</p>
        <p style={{ marginTop: "0.5rem" }}>
          {t("transport.publicTransport.info")}
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>{t("transport.faresLabel")}</strong>{" "}
          {t("transport.publicTransport.fares")}
        </p>
      </div>

      <div className="instruction-block">
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
            flight
          </span>
          {t("transport.airportTransfers.title")}
        </h3>
        <p>{t("transport.airportTransfers.description")}</p>
        <div style={{ marginTop: "1rem" }}>
          {airportOptions.map((option, index) => (
            <div
              key={index}
              className="contact-card"
              style={{ marginBottom: "0.5rem" }}
            >
              <div className="contact-name">{option.name}</div>
              {option.phone && (
                <a
                  href={`tel:${option.phone.replace(/\s/g, "")}`}
                  className="contact-phone"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "1.25rem",
                      verticalAlign: "middle",
                      marginRight: "0.25rem",
                    }}
                  >
                    phone
                  </span>
                  {option.phone}
                </a>
              )}
              <div
                style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
              >
                {option.type}
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          {t("transport.airportTransfers.note")}
        </p>
      </div>

      <div className="instruction-block">
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
            directions_car
          </span>
          {t("transport.carRental.title")}
        </h3>
        <p>{t("transport.carRental.description")}</p>
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          {t("transport.carRental.note")}
        </p>
      </div>
    </div>
  );
}

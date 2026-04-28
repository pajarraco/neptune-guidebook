import { useTranslation } from "react-i18next";

export default function TransportSection() {
  const { t } = useTranslation();

  const airportOptions = t("transport.airportTransfers.options", {
    returnObjects: true,
  }) as Array<{ name: string; phone?: string; type: string }>;

  return (
    <div className="section-content">
      <h1>{t("transport.sectionTitle")}</h1>

      <div className="instruction-block">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
            local_parking
          </span>
          {t("transport.parking.title")}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("transport.parking.description"),
          }}
        />
      </div>

      <div className="instruction-block">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
            local_taxi
          </span>
          {t("transport.rideshare.title")}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("transport.rideshare.description"),
          }}
        />
      </div>

      <div className="instruction-block">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
            tram
          </span>
          {t("transport.publicTransport.title")}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("transport.publicTransport.description"),
          }}
        />
        <p
          style={{ marginTop: "0.5rem" }}
          dangerouslySetInnerHTML={{
            __html: t("transport.publicTransport.info"),
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <strong>{t("transport.faresLabel")}</strong>{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: t("transport.publicTransport.fares"),
            }}
          />
        </p>
      </div>

      <div className="instruction-block">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
            flight
          </span>
          {t("transport.airportTransfers.title")}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("transport.airportTransfers.description"),
          }}
        />
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
                  <span className="material-symbols-outlined icon-base icon-middle icon-mr-xs icon-sand">
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
        <p
          style={{ marginTop: "1rem", fontStyle: "italic" }}
          dangerouslySetInnerHTML={{
            __html: t("transport.airportTransfers.note"),
          }}
        />
      </div>

      <div className="instruction-block">
        <h3>
          <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
            directions_car
          </span>
          {t("transport.carRental.title")}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("transport.carRental.description"),
          }}
        />
        <p
          style={{ marginTop: "0.5rem", fontStyle: "italic" }}
          dangerouslySetInnerHTML={{ __html: t("transport.carRental.note") }}
        />
      </div>
    </div>
  );
}

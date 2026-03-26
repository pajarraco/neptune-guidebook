import guidebookDataRaw from "../assets/guidebook-data.json";
import type { GuidebookData } from "../types";

const guidebookData = guidebookDataRaw as GuidebookData;

export default function TransportSection() {
  const { transport } = guidebookData;

  return (
    <div className="section-content">
      <h2>{transport.sectionTitle}</h2>

      {transport.carRental && (
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
            {transport.carRental.title}
          </h3>
          <p>{transport.carRental.description}</p>
          {transport.carRental.note && (
            <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
              {transport.carRental.note}
            </p>
          )}
        </div>
      )}

      {transport.rideshare && (
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
            {transport.rideshare.title}
          </h3>
          <p>{transport.rideshare.description}</p>
        </div>
      )}

      {transport.airportTransfers && (
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
            {transport.airportTransfers.title}
          </h3>
          {transport.airportTransfers.description && (
            <p>{transport.airportTransfers.description}</p>
          )}
          <div style={{ marginTop: "1rem" }}>
            {transport.airportTransfers.options.map((option, index) => (
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
          {transport.airportTransfers.note && (
            <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
              {transport.airportTransfers.note}
            </p>
          )}
        </div>
      )}

      {transport.publicTransport && (
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
            {transport.publicTransport.title}
          </h3>
          <p>{transport.publicTransport.description}</p>
          <p style={{ marginTop: "0.5rem" }}>
            {transport.publicTransport.info}
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <strong>{transport.faresLabel}</strong> {transport.publicTransport.fares}
          </p>
          {transport.publicTransport.limitations && (
            <div className="tip-box" style={{ marginTop: "1rem" }}>
              <strong>{transport.pleaseNoteLabel}</strong>
              <p style={{ marginTop: "0.5rem" }}>
                {transport.publicTransport.limitations}
              </p>
            </div>
          )}
        </div>
      )}

      {transport.parking && (
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
            {transport.parking.title}
          </h3>
          <p>{transport.parking.description}</p>
        </div>
      )}
    </div>
  );
}

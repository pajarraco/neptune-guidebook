import { useState, useEffect } from "react";
import guidebookDataRaw from "../assets/guidebook-data.json";
import type { GuidebookData } from "../types";

const guidebookData = guidebookDataRaw as GuidebookData;
const STORAGE_KEY = "checkout-checklist-state";

export default function CheckInOutSection() {
  const { checkInOut } = guidebookData;

  // Initialize state from localStorage
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      }
    } catch (error) {
      console.error("Error loading checkout state from localStorage:", error);
    }
    return new Set();
  });

  // Save to localStorage whenever checkedItems changes
  useEffect(() => {
    try {
      const itemsArray = Array.from(checkedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsArray));
    } catch (error) {
      console.error("Error saving checkout state to localStorage:", error);
    }
  }, [checkedItems]);

  const toggleCheckItem = (index: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="section-content">
      <h2>Check-in & Check-out Instructions</h2>

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
            key
          </span>
          {checkInOut.checkIn.title}
        </h3>
        {checkInOut.checkIn.description && (
          <p>{checkInOut.checkIn.description}</p>
        )}

        {checkInOut.checkIn.arrivingEarly && (
          <div
            className="tip-box"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <strong>Arriving early?</strong>
            <p style={{ marginTop: "0.5rem" }}>
              {checkInOut.checkIn.arrivingEarly}
            </p>
          </div>
        )}

        {checkInOut.checkIn.note && (
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            {checkInOut.checkIn.note}
          </p>
        )}

        <h4 style={{ marginTop: "1.5rem" }}>Access Codes & Arrival Info</h4>
        <ol className="instruction-list">
          {checkInOut.checkIn.steps.map((step, index) => {
            const doorCode = import.meta.env.VITE_CODE || "";
            const processedStep = step.replace("{{CODE}}", doorCode);
            return (
              <li
                key={index}
                dangerouslySetInnerHTML={{ __html: processedStep }}
              />
            );
          })}
        </ol>

        {checkInOut.checkIn.personalMeet && (
          <p style={{ marginTop: "1rem" }}>{checkInOut.checkIn.personalMeet}</p>
        )}

        {checkInOut.checkIn.codeNotReceived && (
          <div className="tip-box" style={{ marginTop: "1rem" }}>
            <strong
              dangerouslySetInnerHTML={{
                __html: checkInOut.checkIn.codeNotReceived,
              }}
            />
          </div>
        )}
      </div>

      {checkInOut.tip && (
        <div className="tip-box">
          <p>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
                color: "var(--sand-color)",
              }}
            >
              lightbulb
            </span>
            {checkInOut.tip}
          </p>
        </div>
      )}

      {checkInOut.directions && (
        <div className="instruction-block">
          <h3>{checkInOut.directions.title}</h3>
          <p>{checkInOut.directions.description}</p>
        </div>
      )}

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
            logout
          </span>
          {checkInOut.checkOut.title}
        </h3>
        {checkInOut.checkOut.time && (
          <p>
            <strong>{checkInOut.checkOut.time}</strong>
          </p>
        )}
        {checkInOut.checkOut.lateCheckout && (
          <p style={{ marginTop: "0.5rem" }}>
            {checkInOut.checkOut.lateCheckout}
          </p>
        )}

        <h4 style={{ marginTop: "1.5rem" }}>Please assist us by:</h4>
        <ul className="instruction-list checkout-list">
          {checkInOut.checkOut.steps.map((step, index) => (
            <li
              key={index}
              onClick={() => toggleCheckItem(index)}
              className={checkedItems.has(index) ? "checked" : "unchecked"}
              style={{ cursor: "pointer" }}
            >
              <span className="material-symbols-outlined check-icon">
                {checkedItems.has(index)
                  ? "check_circle"
                  : "radio_button_unchecked"}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

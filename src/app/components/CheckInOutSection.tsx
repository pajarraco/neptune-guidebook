import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "checkout-checklist-state";

export default function CheckInOutSection() {
  const { t } = useTranslation();

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

  const checkInSteps = t("checkInOut.checkIn.steps", {
    returnObjects: true,
  }) as string[];
  const checkOutSteps = t("checkInOut.checkOut.steps", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="section-content">
      <h1>{t("checkInOut.sectionTitle")}</h1>

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
          {t("checkInOut.checkIn.title")}
        </h3>

        <h4 style={{ marginTop: "1.5rem" }}>
          {t("checkInOut.checkIn.subheading")}
        </h4>
        <ol className="instruction-list">
          {checkInSteps.map((step, index) => {
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
      </div>

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
          <span dangerouslySetInnerHTML={{ __html: t("checkInOut.tip") }} />
        </p>
      </div>

      <div className="instruction-block" id="checkout-section">
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
          {t("checkInOut.checkOut.title")}
        </h3>

        <h4 style={{ marginTop: "1.5rem" }}>
          {t("checkInOut.checkOut.subheading")}
        </h4>
        <ul className="instruction-list checkout-list">
          {checkOutSteps.map((step, index) => (
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
              <span dangerouslySetInnerHTML={{ __html: step }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useState } from "react";
import backgroundImage from "../assets/image2.webp";

interface CodeEntryModalProps {
  onCodeVerified: () => void;
  requiredCode: string;
}

export default function CodeEntryModal({
  onCodeVerified,
  requiredCode,
}: CodeEntryModalProps) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputCode === requiredCode) {
      localStorage.setItem("guidebook-access-code", inputCode);
      onCodeVerified();
    } else {
      setError(true);
      setInputCode("");
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="modal-content">
        <div className="modal-header">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "3rem", color: "var(--primary-color)" }}
          >
            lock
          </span>
          <h2>Welcome to Your Guidebook</h2>
          <p>Please enter your access code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="code-entry-form">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter access code"
            className={`code-input ${error ? "error" : ""}`}
            autoFocus
          />

          {error && (
            <p className="error-message">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                  verticalAlign: "middle",
                  marginRight: "0.25rem",
                }}
              >
                error
              </span>
              Incorrect code. Please try again.
            </p>
          )}

          <button type="submit" className="submit-button">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              check_circle
            </span>
            Access Guidebook
          </button>
        </form>

        <p className="help-text">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              marginRight: "0.25rem",
            }}
          >
            info
          </span>
          Your access code was provided in your booking confirmation email.
        </p>
      </div>
    </div>
  );
}

import guidebookData from '../assets/guidebook-data.json';

export default function HouseRulesSection() {
  const { houseRules } = guidebookData;

  return (
    <div className="section-content">
      <h2>House Rules</h2>
      
      <div className="rules-grid">
        {houseRules.rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <span className="material-symbols-outlined rule-icon">{rule.icon}</span>
            <h4>{rule.title}</h4>
            <p>{rule.description}</p>
          </div>
        ))}
      </div>

      <div className="important-note">
        <h3>{houseRules.importantNote.title}</h3>
        <p>{houseRules.importantNote.message}</p>
      </div>
    </div>
  );
}

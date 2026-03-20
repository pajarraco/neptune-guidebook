import guidebookData from '../assets/guidebook-data.json';

export default function EmergencySection() {
  const { emergency } = guidebookData;

  return (
    <div className="section-content">
      <h2>Emergency Contacts</h2>
      
      <div className="emergency-alert">
        <h3>{emergency.alert.title}</h3>
        <p dangerouslySetInnerHTML={{ __html: emergency.alert.message }} />
      </div>

      <div className="contacts-list">
        {emergency.contacts.map((contact, index) => (
          <div key={index} className="contact-card">
            <div className="contact-type">{contact.type}</div>
            <div className="contact-name">{contact.name}</div>
            <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="contact-phone">
              📞 {contact.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="safety-info">
        <h3>{emergency.safetyInfo.title}</h3>
        <ul>
          {emergency.safetyInfo.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="tip-box">
        <strong>{emergency.addressNote}</strong>
      </div>
    </div>
  );
}

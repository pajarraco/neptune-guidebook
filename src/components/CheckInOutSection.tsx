import guidebookData from '../assets/guidebook-data.json';

export default function CheckInOutSection() {
  const { checkInOut } = guidebookData;

  return (
    <div className="section-content">
      <h2>Check-in & Check-out Instructions</h2>
      
      <div className="instruction-block">
        <h3>{checkInOut.checkIn.title}</h3>
        {checkInOut.checkIn.description && <p>{checkInOut.checkIn.description}</p>}
        
        {checkInOut.checkIn.arrivingEarly && (
          <div className="tip-box" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <strong>Arriving early?</strong>
            <p style={{ marginTop: '0.5rem' }}>{checkInOut.checkIn.arrivingEarly}</p>
          </div>
        )}
        
        {checkInOut.checkIn.note && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>{checkInOut.checkIn.note}</p>
        )}
        
        <h4 style={{ marginTop: '1.5rem' }}>Access Codes & Arrival Info</h4>
        <ol className="instruction-list">
          {checkInOut.checkIn.steps.map((step, index) => {
            const doorCode = import.meta.env.VITE_CODE || '';
            const processedStep = step.replace('{{CODE}}', doorCode);
            return <li key={index} dangerouslySetInnerHTML={{ __html: processedStep }} />;
          })}
        </ol>
        
        {checkInOut.checkIn.personalMeet && (
          <p style={{ marginTop: '1rem' }}>{checkInOut.checkIn.personalMeet}</p>
        )}
        
        {checkInOut.checkIn.codeNotReceived && (
          <div className="tip-box" style={{ marginTop: '1rem' }}>
            <strong dangerouslySetInnerHTML={{ __html: checkInOut.checkIn.codeNotReceived }} />
          </div>
        )}
      </div>

      {checkInOut.directions && (
        <div className="instruction-block">
          <h3>{checkInOut.directions.title}</h3>
          <p>{checkInOut.directions.description}</p>
        </div>
      )}

      <div className="instruction-block">
        <h3>{checkInOut.checkOut.title}</h3>
        {checkInOut.checkOut.time && <p><strong>{checkInOut.checkOut.time}</strong></p>}
        {checkInOut.checkOut.lateCheckout && (
          <p style={{ marginTop: '0.5rem' }}>{checkInOut.checkOut.lateCheckout}</p>
        )}
        
        <h4 style={{ marginTop: '1.5rem' }}>Please assist us by:</h4>
        <ul className="instruction-list">
          {checkInOut.checkOut.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import guidebookData from '../assets/guidebook-data.json';

export default function CheckInOutSection() {
  const { checkInOut } = guidebookData;

  return (
    <div className="section-content">
      <h2>Check-in & Check-out Instructions</h2>
      
      <div className="instruction-block">
        <h3>{checkInOut.checkIn.title}</h3>
        <ol className="instruction-list">
          {checkInOut.checkIn.steps.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
      </div>

      <div className="instruction-block">
        <h3>{checkInOut.checkOut.title}</h3>
        <ol className="instruction-list">
          {checkInOut.checkOut.steps.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
      </div>

      <div className="tip-box">
        <strong dangerouslySetInnerHTML={{ __html: checkInOut.tip }} />
      </div>
    </div>
  );
}

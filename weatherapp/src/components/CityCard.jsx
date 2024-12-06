import { Card, Badge, Button } from 'react-bootstrap';
import { TrashFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function CityCard({ weatherData, isUserLocation, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Previeni la navigazione se il click è sul bottone delete
    if (e.target.closest('.delete-btn')) return;
    navigate(`/city/${weatherData.id}`, { state: { weatherData } });
  };

  return (
    <Card 
      className="h-100 shadow-sm cursor-pointer" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <Card.Title className="mb-0">{weatherData.name}</Card.Title>
            {isUserLocation && (
              <Badge bg="primary" className="ms-2">La tua posizione</Badge>
            )}
          </div>
          {!isUserLocation && (
            <Button 
              variant="link" 
              className="delete-btn p-0 ms-2 text-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{ 
                border: 'none', 
                background: 'none',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <TrashFill size={20} />
            </Button>
          )}
        </div>
        <div className="text-center mb-3">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <h2>{Math.round(weatherData.main.temp)}°C</h2>
        </div>
        <div className="weather-details">
          <div className="mb-2">{weatherData.weather[0].description}</div>
          <div className="mb-2">Umidità: {weatherData.main.humidity}%</div>
          <div>Vento: {weatherData.wind.speed} m/s</div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CityCard;

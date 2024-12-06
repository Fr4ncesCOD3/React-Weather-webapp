import { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './NextDays.css';

function NextDays({ lat, lon }) {
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric&lang=it`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const currentData = await response.json();

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric&lang=it`
        );

        if (!forecastResponse.ok) {
          throw new Error(`HTTP error! status: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();
        
        const combinedData = [
          {
            dt: currentData.dt,
            main: currentData.main,
            weather: currentData.weather,
            dt_txt: new Date(currentData.dt * 1000).toISOString()
          },
          ...forecastData.list.slice(0, 7)
        ];

        setHourlyData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Errore nel caricamento dei dati orari:', error);
        setError('Impossibile caricare le previsioni orarie. Riprova più tardi.');
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchHourlyData();
    }
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="hourly-forecast d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hourly-forecast">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="hourly-forecast">
        <Alert variant="info">
          Nessuna previsione disponibile al momento.
        </Alert>
      </div>
    );
  }

  return (
    <div className="hourly-forecast">
      <h3 className="mb-4">Previsioni orarie</h3>
      <div className="forecast-scroll">
        {hourlyData.map((hour, index) => (
          <div key={index} className="forecast-card d-flex flex-column justify-content-between">
            <div className="d-flex flex-column align-items-center">
              <p className="hour mb-2">
                {new Date(hour.dt * 1000).toLocaleTimeString('it-IT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <div className="weather-icon-container mb-1">
                <img
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                  alt={hour.weather[0].description}
                  className="img-fluid"
                />
              </div>
              <p className="temp mb-0">{Math.round(hour.main.temp)}°</p>
            </div>
            <p className="description small text-center mb-0">
              {hour.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextDays;

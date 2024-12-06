import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import NextDays from './NextDays';
import GraphicWeather from './GraphicWeather';
import './SingleCity.css';

function SingleCity() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { weatherData } = state;

  return (
    <div className="single-city-container">
      <div className="city-backdrop"></div>
      <Container className="position-relative">
        <Button 
          variant="link" 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={25} className="me-2" />
          Torna alla home
        </Button>

        <div className="city-header text-center">
          <h1 className="city-name">{weatherData.name}</h1>
          <div className="temperature-display">
            <h2 className="current-temp">{Math.round(weatherData.main.temp)}°</h2>
            <p className="weather-description">{weatherData.weather[0].description}</p>
          </div>
          <div className="temp-range">
            <span>Min: {Math.round(weatherData.main.temp_min)}° </span>
            <span className="mx-2">|</span>
            <span>Max: {Math.round(weatherData.main.temp_max)}°</span>
          </div>
        </div>

        <div className="weather-details-grid">
          <Row className="g-3">
            <Col md={4}>
              <div className="weather-detail-card">
                <h5>Umidità</h5>
                <p>{weatherData.main.humidity}%</p>
                <div className="detail-icon humidity-icon"></div>
              </div>
            </Col>
            <Col md={4}>
              <div className="weather-detail-card">
                <h5>Vento</h5>
                <p>{weatherData.wind.speed} m/s</p>
                <div className="detail-icon wind-icon"></div>
              </div>
            </Col>
            <Col md={4}>
              <div className="weather-detail-card">
                <h5>Pressione</h5>
                <p>{weatherData.main.pressure} hPa</p>
                <div className="detail-icon pressure-icon"></div>
              </div>
            </Col>
          </Row>
        </div>

        <NextDays cityId={weatherData.id} lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
        <GraphicWeather lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
      </Container>
    </div>
  );
}

export default SingleCity;

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalCheck from './components/ModalCheck';
import SearchCity from './components/SearchCity';
import CityList from './components/CityList';
import SingleCity from './components/SingleCity';
import ErrorConnect from './components/ErrorConnect';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [cities, setCities] = useState(() => {
    const savedCities = localStorage.getItem('cities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    // Controlla se è la prima visita e se ci sono dati salvati
    const hasVisited = localStorage.getItem('hasVisited');
    const savedLocation = localStorage.getItem('userLocation');
    
    if (hasVisited && savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
      setShowModal(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLocationAccept = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
        );
        const data = await response.json();
        setUserLocation(data);
        localStorage.setItem('userLocation', JSON.stringify(data));
        localStorage.setItem('hasVisited', 'true');
        setShowModal(false);
      },
      (error) => {
        console.error(error);
        setShowModal(false);
      }
    );
  };

  // Aggiorna periodicamente i dati meteo della posizione utente
  useEffect(() => {
    if (userLocation) {
      const updateWeather = async () => {
        const { coord } = userLocation;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
        );
        const data = await response.json();
        setUserLocation(data);
        localStorage.setItem('userLocation', JSON.stringify(data));
      };

      // Aggiorna i dati ogni 10 minuti
      const interval = setInterval(updateWeather, 600000);
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  // Se l'utente è offline, mostra il componente ErrorConnect
  if (!isOnline) {
    return <ErrorConnect />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="home-container">
            <div className="city-backdrop"></div>
            <div className="content-container">
              <h1 className="app-title">Weather App</h1>
              {showModal && <ModalCheck onAccept={handleLocationAccept} onDecline={() => setShowModal(false)} />}
              <SearchCity setCities={setCities} />
              <CityList cities={cities} userLocation={userLocation} setCities={setCities} />
            </div>
          </div>
        } />
        <Route path="/city/:id" element={<SingleCity />} />
      </Routes>
    </Router>
  );
}

export default App;

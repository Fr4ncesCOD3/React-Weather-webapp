// Importiamo gli hook e i componenti necessari da React e altre librerie
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalCheck from './components/ModalCheck';
import SearchCity from './components/SearchCity';
import CityList from './components/CityList';
import SingleCity from './components/SingleCity';
import ErrorConnect from './components/ErrorConnect';
import './App.css';

// Componente principale dell'applicazione
function App() {
  // Stato per controllare se mostrare il modal di richiesta posizione
  const [showModal, setShowModal] = useState(false);
  // Stato per memorizzare la posizione dell'utente
  const [userLocation, setUserLocation] = useState(null);
  // Stato per memorizzare la lista delle città, inizializzato con i dati dal localStorage se presenti
  const [cities, setCities] = useState(() => {
    const savedCities = localStorage.getItem('cities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  // Stato per controllare se l'utente è online
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  // Effetto che controlla se l'utente ha già visitato l'app
  useEffect(() => {
    const checkLocationPermission = async () => {
      const hasVisited = localStorage.getItem('hasVisited');
      const savedLocation = localStorage.getItem('userLocation');

      if (hasVisited && savedLocation) {
        // Se l'utente ha già visitato e ha una posizione salvata
        setUserLocation(JSON.parse(savedLocation));
      } else {
        try {
          // Verifichiamo se il browser supporta la geolocalizzazione
          if ('geolocation' in navigator) {
            // Verifichiamo lo stato del permesso
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            
            if (permission.state === 'granted') {
              // Se il permesso è già stato concesso, otteniamo la posizione
              handleLocationAccept();
            } else if (permission.state === 'prompt') {
              // Se il permesso non è stato ancora richiesto, mostriamo il modale
              setShowModal(true);
            }
          }
        } catch (error) {
          console.error('Errore nel controllo dei permessi:', error);
        }
      }
    };

    checkLocationPermission();
  }, []);

  // Effetto che salva le città nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('cities', JSON.stringify(cities));
  }, [cities]);

  // Effetto che gestisce lo stato online/offline dell'app
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Aggiunge i listener per gli eventi online/offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Rimuove i listener quando il componente viene smontato
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Funzione chiamata quando l'utente accetta di condividere la posizione
  const handleLocationAccept = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
          );
          
          if (!response.ok) {
            throw new Error('Errore nel recupero dei dati meteo');
          }

          const data = await response.json();
          setUserLocation(data);
          localStorage.setItem('userLocation', JSON.stringify(data));
          localStorage.setItem('hasVisited', 'true');
        } catch (error) {
          console.error('Errore nel recupero dei dati meteo:', error);
        }
        setShowModal(false);
      },
      (error) => {
        console.error('Errore di geolocalizzazione:', error);
        setShowModal(false);
      },
      options
    );
  };

  // Effetto che aggiorna periodicamente i dati meteo della posizione utente
  useEffect(() => {
    if (userLocation) {
      const updateWeather = async () => {
        const { coord } = userLocation;
        // Chiama l'API per aggiornare i dati meteo
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
        );
        const data = await response.json();
        // Aggiorna i dati nello stato e nel localStorage
        setUserLocation(data);
        localStorage.setItem('userLocation', JSON.stringify(data));
      };

      // Imposta un intervallo per aggiornare i dati ogni 10 minuti
      const interval = setInterval(updateWeather, 600000);
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  // Se l'utente è offline, mostra il componente di errore
  if (!isOnline) {
    return <ErrorConnect />;
  }

  // Renderizza l'interfaccia principale dell'app
  return (
    <Router>
      <Routes>
        {/* Rotta principale che mostra la home page */}
        <Route path="/" element={
          <div className="home-container">
            <div className="city-backdrop"></div>
            <div className="content-container">
              <h1 className="app-title">Weather App</h1>
              {showModal && (
                <ModalCheck 
                  onAccept={handleLocationAccept} 
                  onDecline={() => {
                    setShowModal(false);
                    localStorage.setItem('hasVisited', 'true');
                  }} 
                />
              )}
              {/* Componente per cercare le città */}
              <SearchCity setCities={setCities} />
              {/* Lista delle città salvate */}
              <CityList cities={cities} userLocation={userLocation} setCities={setCities} />
            </div>
          </div>
        } />
        {/* Rotta per visualizzare i dettagli di una singola città */}
        <Route path="/city/:id" element={<SingleCity />} />
      </Routes>
    </Router>
  );
}

// Esporta il componente App
export default App;

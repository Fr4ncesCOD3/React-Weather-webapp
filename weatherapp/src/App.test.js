import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SearchCity from './components/SearchCity';
import CityCard from './components/CityCard';
import ErrorConnect from './components/ErrorConnect';

// Mock di window.navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

// Mock delle funzioni fetch per l'API OpenWeather
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Roma',
      id: 1,
      coord: { lat: 41.89, lon: 12.48 },
      main: { temp: 20, humidity: 65, temp_min: 18, temp_max: 22 },
      weather: [{ description: 'cielo sereno', icon: '01d' }],
      wind: { speed: 2.1 }
    })
  })
);

// Wrapper per il router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renderizza il titolo principale', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });

  test('mostra il modal di geolocalizzazione al primo accesso', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Richiesta di Geolocalizzazione')).toBeInTheDocument();
  });

  test('non mostra il modal se già visitato', () => {
    localStorage.setItem('hasVisited', 'true');
    localStorage.setItem('userLocation', JSON.stringify({ 
      name: 'Roma',
      coord: { lat: 41.89, lon: 12.48 }
    }));
    renderWithRouter(<App />);
    expect(screen.queryByText('Richiesta di Geolocalizzazione')).not.toBeInTheDocument();
  });
});

describe('ErrorConnect Component', () => {
  test('mostra il messaggio di errore quando offline', () => {
    render(<ErrorConnect />);
    expect(screen.getByText('Oops! Sei Offline')).toBeInTheDocument();
    expect(screen.getByText('Sembra che la tua connessione internet sia assente.')).toBeInTheDocument();
  });
});

describe('SearchCity Component', () => {
  test('mostra il campo di ricerca', () => {
    render(<SearchCity setCities={() => {}} />);
    expect(screen.getByPlaceholderText('Cerca una città...')).toBeInTheDocument();
  });

  test('effettua la ricerca quando si inserisce testo', async () => {
    render(<SearchCity setCities={() => {}} />);
    const searchInput = screen.getByPlaceholderText('Cerca una città...');
    
    fireEvent.change(searchInput, { target: { value: 'Roma' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org/geo/1.0/direct')
      );
    });
  });
});

describe('CityCard Component', () => {
  const mockWeatherData = {
    name: 'Roma',
    id: 1,
    coord: { lat: 41.89, lon: 12.48 },
    main: { temp: 20, humidity: 65, temp_min: 18, temp_max: 22 },
    weather: [{ description: 'cielo sereno', icon: '01d' }],
    wind: { speed: 2.1 }
  };

  test('renderizza correttamente i dati meteo', () => {
    renderWithRouter(
      <CityCard 
        weatherData={mockWeatherData}
        isUserLocation={false}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText('Roma')).toBeInTheDocument();
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText('cielo sereno')).toBeInTheDocument();
    expect(screen.getByText('Umidità: 65%')).toBeInTheDocument();
    expect(screen.getByText('Vento: 2.1 m/s')).toBeInTheDocument();
  });

  test('mostra il badge per la posizione utente', () => {
    renderWithRouter(
      <CityCard 
        weatherData={mockWeatherData}
        isUserLocation={true}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText('La tua posizione')).toBeInTheDocument();
  });
});

// Importiamo gli hook e i componenti necessari da React e react-bootstrap
import { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';

// Componente SearchCity che permette di cercare e selezionare città
// Riceve come prop setCities per aggiornare la lista delle città
function SearchCity({ setCities }) {
  // State per gestire il testo inserito nella ricerca
  const [searchTerm, setSearchTerm] = useState('');
  // State per gestire l'elenco dei suggerimenti delle città
  const [suggestions, setSuggestions] = useState([]);

  // Funzione che gestisce la ricerca quando l'utente digita
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Aggiorniamo il testo di ricerca

    // Facciamo la ricerca solo se sono stati inseriti almeno 3 caratteri
    if (value.length > 2) {
      // Chiamata API per ottenere i suggerimenti delle città
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=91bd6826b018c209080e0d7dab93d4e3`
      );
      const data = await response.json();
      setSuggestions(data); // Aggiorniamo i suggerimenti con i risultati
    } else {
      setSuggestions([]); // Se il testo è troppo corto, svuotiamo i suggerimenti
    }
  };

  // Funzione chiamata quando l'utente seleziona una città
  const handleCitySelect = async (city) => {
    // Chiamata API per ottenere i dati meteo della città selezionata
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
    );
    const weatherData = await weatherResponse.json();
    
    // Aggiorniamo la lista delle città
    setCities(prev => {
      const newCities = [...prev, weatherData]; // Aggiungiamo la nuova città
      // Salviamo la lista aggiornata nel localStorage per persistenza
      localStorage.setItem('cities', JSON.stringify(newCities));
      return newCities;
    });
    
    // Resettiamo il form di ricerca
    setSearchTerm('');
    setSuggestions([]);
  };

  // Renderizziamo l'interfaccia di ricerca
  return (
    <div className="mb-4">
      {/* Campo di input per la ricerca */}
      <Form.Control
        type="text"
        placeholder="Cerca una città..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Lista dei suggerimenti (mostrata solo se ci sono risultati) */}
      {suggestions.length > 0 && (
        <ListGroup className="mt-2">
          {/* Mappiamo i suggerimenti per creare la lista */}
          {suggestions.map((city, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.country} {/* Mostriamo nome città e paese */}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

// Esportiamo il componente per usarlo in altre parti dell'app
export default SearchCity;

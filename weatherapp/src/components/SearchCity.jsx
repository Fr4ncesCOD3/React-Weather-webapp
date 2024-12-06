import { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';

function SearchCity({ setCities }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      // Usa l'API di geocoding per ottenere le città
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=91bd6826b018c209080e0d7dab93d4e3`
      );
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleCitySelect = async (city) => {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric`
    );
    const weatherData = await weatherResponse.json();
    setCities(prev => {
      const newCities = [...prev, weatherData];
      localStorage.setItem('cities', JSON.stringify(newCities));
      return newCities;
    });
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="mb-4">
      <Form.Control
        type="text"
        placeholder="Cerca una città..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {suggestions.length > 0 && (
        <ListGroup className="mt-2">
          {suggestions.map((city, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.country}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default SearchCity;

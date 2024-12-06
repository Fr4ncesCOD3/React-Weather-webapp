// Importiamo il componente CityCard che useremo per mostrare i dati di ogni città
import CityCard from './CityCard';

// Componente CityList che mostra la lista delle città
// Riceve come props:
// - cities: array delle città salvate
// - userLocation: dati della posizione dell'utente
// - setCities: funzione per aggiornare l'array delle città
function CityList({ cities, userLocation, setCities }) {
  // Funzione che gestisce l'eliminazione di una città
  const handleDelete = (indexToDelete) => {
    // Aggiorna lo state delle città usando setCities
    setCities(prevCities => {
      // Crea un nuovo array filtrando la città da eliminare
      const newCities = prevCities.filter((_, index) => index !== indexToDelete);
      // Salva il nuovo array nel localStorage
      localStorage.setItem('cities', JSON.stringify(newCities));
      // Ritorna il nuovo array che verrà usato come nuovo state
      return newCities;
    });
  };

  return (
    // Container con griglia responsive (g-4 aggiunge spazio tra le colonne)
    <div className="row g-4">
      {/* Se esiste userLocation, mostra la card della posizione utente */}
      {userLocation && (
        <div className="col-md-4">
          <CityCard weatherData={userLocation} isUserLocation={true} />
        </div>
      )}
      {/* Mappa l'array delle città e crea una CityCard per ognuna */}
      {cities.map((city, index) => (
        // key è necessaria per React quando si fa il mapping di elementi
        <div key={index} className="col-md-4">
          <CityCard 
            weatherData={city} // Passa i dati meteo della città
            isUserLocation={false} // Indica che non è la posizione utente
            onDelete={() => handleDelete(index)} // Passa la funzione per eliminare
          />
        </div>
      ))}
    </div>
  );
}

// Esporta il componente per usarlo in altre parti dell'app
export default CityList;

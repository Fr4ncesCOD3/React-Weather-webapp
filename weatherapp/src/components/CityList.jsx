import CityCard from './CityCard';

function CityList({ cities, userLocation, setCities }) {
  const handleDelete = (indexToDelete) => {
    setCities(prevCities => {
      const newCities = prevCities.filter((_, index) => index !== indexToDelete);
      localStorage.setItem('cities', JSON.stringify(newCities));
      return newCities;
    });
  };

  return (
    <div className="row g-4">
      {userLocation && (
        <div className="col-md-4">
          <CityCard weatherData={userLocation} isUserLocation={true} />
        </div>
      )}
      {cities.map((city, index) => (
        <div key={index} className="col-md-4">
          <CityCard 
            weatherData={city} 
            isUserLocation={false}
            onDelete={() => handleDelete(index)}
          />
        </div>
      ))}
    </div>
  );
}

export default CityList;

import React, { useState, useEffect } from "react";

const App = () => {

  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      if (search) {
        try {
          const response = await fetch(`https://restcountries.com/v3.1/name/${search}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setCountries(result);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchCountries();
  }, [search]);

  useEffect(() => {
    const fetchWeather = async (country) => {
     
      if (country) {
        try {
          const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
          
          if (!apiKey) {
            throw new Error('API key is undefined');
          }
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}&units=metric`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setWeather(result);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    fetchWeather(selectedCountry);
  }, [selectedCountry]);

  return (
    <>
      <p>Find countries</p>
      <SearchHandler search={search} setSearch={setSearch} />
      <div>
        {error ? (
          <p>{error}</p>
        ) : selectedCountry ? (
          <CountryDetail country={selectedCountry} weather={weather} />
        ) : (
          <CountriesList countries={countries} setSelectedCountry={setSelectedCountry} />
        )}
      </div>
    </>
  );
};

const CountriesList = ({ countries, setSelectedCountry }) => {
  useEffect(() => {
    if (countries.length === 1) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, setSelectedCountry]);

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length === 1) {
    return null;
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          <p>{country.name.common}</p>
          <button onClick={() => setSelectedCountry(country)}>Show</button>
        </div>
      ))}
    </div>
  );
};

const CountryDetail = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <p>Languages: {Object.values(country.languages).join(', ')}</p>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>{weather.weather[0].icon && (
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
          )}</p>
        </div>
      )}
    </div>
  );
};

const SearchHandler = ({ search, setSearch }) => {
  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <form>
      <input value={search} onChange={handleChange} />
    </form>
  );
};

export default App;

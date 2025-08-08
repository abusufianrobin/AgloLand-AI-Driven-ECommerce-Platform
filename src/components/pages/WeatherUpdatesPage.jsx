import React, { useState} from 'react';
// Import local images from the assets directory
// Ensure these paths are correct relative to your project structure (e.g., src/assets/weather_icons/clear.png)
import clearImg from '../../assets/weather_icons/clear.png';
import cloudyImg from '../../assets/weather_icons/cludy.png'; 
import drizzleImg from '../../assets/weather_icons/drizzle.png';
import humidityImg from '../../assets/weather_icons/humidity.png';
import mistImg from '../../assets/weather_icons/mist.png';
import rainImg from '../../assets/weather_icons/rain.png';
import searchImg from '../../assets/weather_icons/search.png';
import windImg from '../../assets/weather_icons/wind.png'; // Added: for wind icon

const WeatherUpdatesPage = () => {
  
  // ====================================================================================
  // >>> IMPORTANT: PASTE YOUR ACTUAL OPENWEATHERMAP API KEY HERE <<<
  // You can get a free API key from https://openweathermap.org/api
  // New keys can take up to 2 hours to activate.
  const API_KEY = 'e84682b40cce2f53397c9ee8e1331a87'; // THIS IS A PLACEHOLDER. REPLACE WITH YOUR REAL KEY.

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [weatherIcon, setWeatherIcon] = useState(rainImg); // Default icon

  // Function to fetch weather data from OpenWeatherMap API
  const checkWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    // --- CORRECTED API KEY VALIDATION LOGIC ---
    // This check now correctly identifies if the placeholder is still present
    // or if the key entered is suspiciously short.
    if (API_KEY === 'e84682b40cce2f53397c9ee8e1331a87' || API_KEY.length < 20) {
        setError("OpenWeatherMap API Key is missing or invalid. Please configure it correctly in WeatherUpdatesPage.jsx. See instructions in the code.");
        setLoading(false);
        setWeatherData(null);
        return; // Exit function immediately if API key is invalid
    }
    // --- END CORRECTED VALIDATION LOGIC ---

    setLoading(true);
    setError(''); // Clear previous errors
    setWeatherData(null); // Clear previous weather data

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        const errorDetails = await response.json(); // OpenWeatherMap typically sends JSON errors
        let customErrorMessage = `Error: ${response.status}.`;

        if (response.status === 401) {
            customErrorMessage = "Error 401: Unauthorized. Please verify your OpenWeatherMap API key (it might be incorrect or not yet active). New keys can take up to 2 hours to activate.";
        } else if (response.status === 404) {
            customErrorMessage = "Error 404: City not found. Please check the city name and try again.";
        } else if (errorDetails && errorDetails.message) {
            customErrorMessage += ` ${errorDetails.message}`; // Use API's specific error message if available
        } else {
            customErrorMessage += " Could not fetch weather data. Please try again later.";
        }
        
        setError(customErrorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      setWeatherData({
        cityName: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0].main,
      });

      const condition = data.weather[0].main.toLowerCase();
      switch (condition) {
        case "clouds":
          setWeatherIcon(cloudyImg);
          break;
        case "clear":
          setWeatherIcon(clearImg);
          break;
        case "rain":
          setWeatherIcon(rainImg);
          break;
        case "drizzle":
          setWeatherIcon(drizzleImg);
          break;
        case "mist":
        case "haze":
        case "fog":
          setWeatherIcon(mistImg);
          break;
        default:
          setWeatherIcon(rainImg); // Fallback icon if no match
      }

    } catch (err) {
      console.error("Network or fetch error:", err);
      setError("A network error occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkWeather(city);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-800 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-8 shadow-xl text-center">
        {/* Search Bar */}
        <div className="flex items-center justify-between w-full mb-6">
          <input
            type="text"
            className="border-0 outline-none bg-white text-gray-700 py-3 px-6 rounded-3xl flex-1 mr-4 text-lg placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-green-300 transition-all duration-200"
            placeholder="Enter City Name"
            spellCheck="false"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={() => checkWeather(city)}
            className="border-0 outline-none bg-white rounded-full w-14 h-14 cursor-pointer flex items-center justify-center shadow-md hover:bg-gray-100 transition transform hover:scale-105"
          >
            <img src={searchImg} alt="Search" className="w-6 h-6" />
          </button>
        </div>

        {/* Loading and Error Messages */}
        {loading && <p className="text-white text-lg mb-4">Loading weather data...</p>}
        {error && (
          <div className="bg-red-500 text-white text-lg mb-4 font-semibold p-3 rounded-xl shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div className="weather-display transition-opacity duration-500 ease-in-out opacity-100">
            <img src={weatherIcon} alt="Weather Icon" className="w-36 mt-7 mx-auto block mb-4" />
            <h1 className="text-6xl font-semibold mb-2">{weatherData.temp}°C</h1>
            <h2 className="text-4xl font-medium mb-6">{weatherData.cityName}</h2>
            
            {/* Details Section (Humidity & Wind Speed) */}
            <div className="flex items-center justify-between px-5 mt-10">
              <div className="flex items-center flex-1 justify-center px-4">
                <img src={humidityImg} alt="Humidity Icon" className="w-10 mr-2" />
                <div className="text-left">
                  <p className="text-2xl font-medium">{weatherData.humidity}%</p>
                  <p className="text-sm">Humidity</p>
                </div>
              </div>
              <div className="flex items-center flex-1 justify-center px-4">
                <img src={windImg} alt="Wind Icon" className="w-10 mr-2" /> 
                <div className="text-left">
                  <p className="text-2xl font-medium">{weatherData.windSpeed} km/h</p>
                  <p className="text-sm">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherUpdatesPage;
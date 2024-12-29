import React, { useState, useCallback } from 'react';
import searchButton from './images/search button.webp'
import wind from './images/wind.png'
import humidity from './images/humidity.webp'
import cloudy from './images/cloudy.png'
import sun from './images/sun.png'
import haze from './images/haze.png'
import rain from './images/rain.png'
import drizzle from './images/rain.png'
import './Home.css';

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const apiKey = "1afcff7ef65dd7cbc1f87a5c81d661b9";

    const checkWeather = async () => {
        console.log(city);

        if (!city.trim()) {
            setError('Please enter a city name.');
            return;
        }

        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            console.log(data);


            if (response.ok) {
                setWeatherData(data);
                setError(null);
            } else {
                setError(data.message || 'Failed to fetch weather data.');
                setWeatherData(null);
            }
        } catch (error) {
            setError('An error occurred while fetching weather data.');
            setWeatherData(null);
        }
    };


    const failedToGot = () => {
        alert("Failed to get location information");
    }
    const checkWeatherUsingLocation = useCallback(async (position) => {

        console.log("Current location: ", position);
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log(`Latitude: ${lat} & Longitude ${long}`);

        const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(API_URL);
            console.log(response);

            const data = await response.json();
            console.log("Data using location: ", data);
            console.log(data?.name);



            if (response.ok) {
                setWeatherData(data);
                setError(null);
            } else {
                setError('Failed to fetch weather data.');
                setWeatherData(null);
            }
        } catch (error) {
            setError('An error occurred while fetching weather data.');
            setWeatherData(null);
        }
    }, [])


    const findWeatherusingLocation = () => {
        navigator.geolocation.getCurrentPosition(checkWeatherUsingLocation, failedToGot);
    }

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'Clouds':
                return cloudy;
            case 'Clear':
                return sun;
            case 'Haze':
                return haze;
            case 'Rain':
                return rain;
            case 'Drizzle':
                return drizzle;
            default:
                return cloudy;
        }
    };

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };



    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkWeather();
        }
    };

    return (
        <>
            <div className="card">
                <div className="search">
                    <input
                        type="text"
                        placeholder="ENTER CITY NAME"
                        spellCheck="false"
                        className="cityInput"
                        value={city}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    <button onClick={checkWeather}>
                        <img src={searchButton} alt="SearchButton" />
                    </button>
                </div>


                {error && <p className="error">{error}</p>}

                {weatherData && (
                    <div className="weather">
                        <img
                            src={getWeatherIcon(weatherData?.weather[0].main)}
                            alt="Weather Icon"
                            className="weather-icon"
                        />
                        <h1 className="temp">{weatherData?.main.temp}°C</h1>
                        <h2 className="city">{weatherData?.name}</h2>
                        <div className="details">
                            <div className="col">
                                <img src={humidity} alt="" />
                                <div>
                                    <p className="humidity">{weatherData?.main.humidity}%</p>
                                    <p>HUMIDITY</p>
                                </div>
                            </div>
                            <div className="col">
                                <img src={wind} alt="" />
                                <div>
                                    <p className="wind">{weatherData?.wind.speed} KM/H</p>
                                    <p>WIND SPEED</p>
                                </div>
                            </div>
                        </div>
                    </div>


                )}


                <button className='location' onClick={findWeatherusingLocation}>Use my current location</button>

            </div>
        </>
    );
};

export default Home;

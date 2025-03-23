import React, { useState, useEffect } from 'react';
import MeteoService from "../../../services/MeteoService";

// Mappatura tra Symbol Id e icone di Bootstrap o personalizzate
const weatherIcons = {
    0: "bi bi-question-circle",  // Unknown
    1: "bi bi-brightness-high",  // Clear sky (Day)
    101: "bi bi-moon",           // Clear sky (Night)
    2: "bi bi-cloud-sun",        // Light clouds (Day)
    102: "bi bi-cloud-moon",     // Light clouds (Night)
    3: "bi bi-cloud-sun",        // Partly cloudy (Day)
    103: "bi bi-cloud-moon",     // Partly cloudy (Night)
    4: "bi bi-cloud",            // Cloudy (Day)
    104: "bi bi-cloud",          // Cloudy (Night)
    5: "bi bi-cloud-rain",       // Rain (Day)
    105: "bi bi-cloud-rain",     // Rain (Night)
    6: "bi bi-cloud-sleet",      // Rain and snow / Sleet (Day)
    106: "bi bi-cloud-sleet",    // Rain and snow / Sleet (Night)
    7: "bi bi-cloud-snow",       // Snow (Day)
    107: "bi bi-cloud-snow",     // Snow (Night)
    8: "bi bi-cloud-drizzle",    // Rain shower (Day)
    108: "bi bi-cloud-drizzle",  // Rain shower (Night)
    9: "bi bi-cloud-snow",       // Snow shower (Day)
    109: "bi bi-cloud-snow",     // Snow shower (Night)
    10: "bi bi-cloud-sleet",     // Sleet shower (Day)
    110: "bi bi-cloud-sleet",    // Sleet shower (Night)
    11: "bi bi-cloud-fog2",      // Light fog (Day)
    111: "bi bi-cloud-fog2",     // Light fog (Night)
    12: "bi bi-cloud-fog",       // Dense fog (Day)
    112: "bi bi-cloud-fog",      // Dense fog (Night)
    13: "bi bi-cloud-hail",      // Freezing rain (Day)
    113: "bi bi-cloud-hail",     // Freezing rain (Night)
    14: "bi bi-cloud-lightning", // Thunderstorms (Day)
    114: "bi bi-cloud-lightning",// Thunderstorms (Night)
    15: "bi bi-cloud-drizzle",   // Drizzle (Day)
    115: "bi bi-cloud-drizzle",  // Drizzle (Night)
    16: "bi bi-cloud-haze2",     // Sandstorm (Day)
    116: "bi bi-cloud-haze2"     // Sandstorm (Night)
};

const WeatherInfo = ({ latitude, longitude, date,time }) => {
    const [weatherSymbol, setWeatherSymbol] = useState(null);
    const [temperature, setTemperature] = useState(null)

    useEffect(() => {
        const fetchWeather = async () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Mese (0-11) -> Aggiungi 1 e formatta a due cifre
            const day = String(now.getDate()).padStart(2, '0'); // Format a due cifre

            const formattedDate = `${year}-${month}-${day}`;

            if (date > formattedDate) {
            try {
                const response = await MeteoService.getMeteoInfo(latitude, longitude, date,time);
                setTemperature(response[0]);
                let icon_index= response[1];
                setWeatherSymbol(icon_index);
            } catch (error) {
                console.error("Errore nel recupero dati meteo:", error);
            }}
            else{
                setTemperature(" Not available");
                setWeatherSymbol(0);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="weather-info">
            <div className="label">Weather</div>
            <div className="value">
                {weatherSymbol !== null ? (
                    <>
                        <i className={weatherIcons[weatherSymbol] || "bi bi-question-circle"}></i>
                        <span>{temperature === " Not available" ? temperature : `${temperature}°C`}</span>
                    </>
                ) : (
                    <span>Loading...</span>
                )}
            </div>
        </div>
    );
};

export default WeatherInfo;

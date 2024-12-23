import React, { useState } from 'react';

import CityService from '../../../services/CityService';
import './AddList/AddList.css'

const ThirdStep = ({ nextStep, prevStep, handleChange, values }) => {
    const [error, setError] = useState('');
    
    var newCity = "";                   // fatto con useState non funziona perche' si aggiorna in ritardo
    const setNewCity = (city) => {
        newCity = city;
    };

    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    // Lista delle località
    var locations = [];


    // Quando inserisci delle lettere, per aggiornare i suggerimenti
    const handleInputChange = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        //setNewCity(value)

        // resetta i suggerimenti se il campo e' vuoto
        if (!value) {
            setSuggestions([]);
        }

        // se ci sono meno di tre caratteri, non fare nulla
        if (value.length < 3) {
            return;
        }

        // ottieni suggerimenti dal server
        await updateLocationsFromServer(value);

        //const filteredSuggestions = locations.filter((location) => location.toLowerCase().includes(value.toLowerCase()));
        const filteredSuggestions = locations;
        setSuggestions(filteredSuggestions);
    };


    // Per richiedere al server tutte le citta' che iniziano con la stringa start
    const updateLocationsFromServer = async (start) => {
        try {
            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await CityService.getCitiesStartingWith(start);

            if (response) {
                //console.log(response);
                locations = response.map(city => city.name + ", " + city.country);
                
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };


    // Per aggiungere newCity alla lista di destinazioni scelte
    const addCity = () => {
        if (newCity.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (values.city.includes(newCity.trim())) {
            setError('City already added!');
            return;
        }
        setError('');
        const updatedCities = [...values.city, newCity];
        handleChange({ target: { name: 'city', value: updatedCities } });
        setNewCity('');
    };


    // Per rimuovere una destinazione dalla lista di destinazioni scelte
    const removeCity = (index) => {
        const updatedCities = values.city.filter((_, i) => i !== index);
        handleChange({ target: { name: 'city', value: updatedCities } });
    };


    // Per quando premi invio
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newCity.trim()) {
                addCity();
            } else {
                nextStep();
            }
        }
    };


    // Per quando clicchi su una destinazione dai suggerimenti
    const handleSelect = (location) => {
        //console.log("selected: " + location);

        setNewCity(location);   // Imposta il valore dell'input al suggerimento selezionato
        
        //console.log("newCity: " + newCity);
        
        setSearchTerm("");
        setSuggestions([]);     // Nasconde i suggerimenti
        
        addCity();
    };


    return (
        <div className="trip-creation-page">
            <div className="Step">
                <h2>Where are you going?</h2>
                <div className="city">
                    <label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                    </label>
                    <button onClick={addCity}><i class="bi bi-plus-lg"></i></button>
                </div>
                {/* MESSAGGIO DI ERRORE */}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {/* SUGGERIMENTI CITTA' */}
                {suggestions.length > 0 && (
                <ul className='suggestions'>
                {suggestions.map((location, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelect(location)}
                        className='data'
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                    >
                        {location}
                    </li>
                ))}
                </ul>
                )}
                {/* CITTA' SELEZIONATE */}
                <div id="selected-destinations">
                    {(values.city).length !== 0 && <h6>Selected Cities:</h6>}
                    {(values.city).length !== 0 && <div className="list-city">
                        <ul>
                            {values.city.map((city, index) => (
                                <li key={index}>
                                    {city}
                                    <button onClick={() => removeCity(index)}><i class="bi bi-x"></i></button>
                                </li>
                            ))}
                        </ul>
                    </div>}
                </div>
                {/* PULSANTI PREVIOUS E NEXT */}
                <div className="button-div">
                    <button id="previous" onClick={prevStep}>Previous</button>
                    <button id="next" onClick={nextStep}>Next</button>
                </div>

            </div>
        </div>
    );
};

export default ThirdStep;

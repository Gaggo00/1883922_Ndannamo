import React, { useState } from 'react';

import CityService from '../../services/CityService';

const ThirdStep = ({ nextStep, prevStep, handleChange, values }) => {
    const [error, setError] = useState('');
    
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    // Lista delle località
    var locations = [];


    // Quando inserisci delle lettere, per aggiornare i suggerimenti
    const handleInputChange = async (event) => {
        setError("");
        setSearchTerm(event.target.value);

        const value = event.target.value.trim();

        // se ci sono meno di tre caratteri, resetta i suggerimenti
        if (value.length < 3) {
            setSuggestions([]);
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

    // Per aggiungere searchTerm alla lista di destinazioni scelte (serve per quando premi invio/clicchi sul pulsante +)
    const addCitySearchTerm = () => {

        if (searchTerm.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (values.city.includes(searchTerm.trim())) {
            setError('City already added!');
            return;
        }

        setError('');
        const updatedCities = [...values.city, searchTerm];
        handleChange('city', updatedCities);
        
        setSearchTerm("");
    };

    // Per aggiungere la citta' passata in input alla lista di destinazioni scelte (serve per quando scegli un suggerimento)
    const addCity = (cityToAdd) => {

        if (cityToAdd.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (values.city.includes(cityToAdd.trim())) {
            setError('City already added!');
            return;
        }

        setError('');
        const updatedCities = [...values.city, cityToAdd];
        handleChange('city', updatedCities);
        
        setSearchTerm("");
    };


    // Per rimuovere una destinazione dalla lista di destinazioni scelte
    const removeCity = (index) => {
        const updatedCities = values.city.filter((_, i) => i !== index);
        handleChange('city', updatedCities);
    };


    // Per quando premi invio
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.trim()) {
                addCitySearchTerm();
            } else {
                nextStep();
            }
        }
    };


    // Per quando clicchi su una destinazione dai suggerimenti
    const handleSelect = (index) => {

        setSearchTerm("");
        setSuggestions([]);     // Nasconde i suggerimenti
        
        addCity(suggestions[index]);
    };


    return (
        <div className="trip-creation-page">
            <div className="fill-flex2">
                <div className='top-bar'>
                    <h2>Where are you going?</h2>
                </div>

                {/* CITTA' SELEZIONATE */}
                <div id="selected-destinations">
                    <h6>Selected destinations:</h6>
                    <div id="selected-destinations-internal">
                        {(values.city).length !== 0 && <div className="list-city">
                            <ul>
                                {values.city.map((city, index) => (
                                    <li key={index}>
                                        {city}
                                        <button onClick={() => removeCity(index)}><i className="bi bi-x"></i></button>
                                    </li>
                                ))}
                            </ul>
                        </div>}
                    </div>
                </div>
                {/* CAMPO INPUT */}
                <div className="city">
                    <label>
                        <input
                            id = "text-input"
                            type="text"
                            className='input-long'
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder='Type a destination'
                        />
                    </label>
                    <button onClick={addCitySearchTerm}><i className="bi bi-plus-lg"></i></button>
                </div>
                {/* MESSAGGIO DI ERRORE */}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {/* SUGGERIMENTI CITTA' */}
                {suggestions.length > 0 && (
                <div className='suggestions'>
                    <div className='suggestions-items'>
                        {suggestions.map((location, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(index)}
                            className='data'
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                        >
                            <strong>{location.substring(0,document.getElementById("text-input").value.trim().length)}</strong>{location.substring(document.getElementById("text-input").value.trim().length)}
                        </li>
                        ))}
                    </div>
                </div>
                )}
            </div>
            {/* PULSANTI PREVIOUS E NEXT */}
            <div className="auto-flex2">
                <button id="previous" onClick={prevStep}>Previous</button>
                <button id="next" onClick={nextStep}>Next</button>
            </div>
        </div>
    );
};

export default ThirdStep;


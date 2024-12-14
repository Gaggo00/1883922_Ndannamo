import React, { useState } from "react";

import CityService from "../../services/CityService";

import {BsPlus} from 'react-icons/bs';
import './AddList.css'


function AddList({destinations, setDestinations}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Lista delle località
    var locations = [];

    const handleChange = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);

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

        const filteredSuggestions = locations.filter((location) => location.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(filteredSuggestions);
    };

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



    const handleSelect = (location) => {
        setSearchTerm(location); // Imposta il valore dell'input al suggerimento selezionato
        setSuggestions([]); // Nasconde i suggerimenti
        var newFinalList = destinations.slice()
        newFinalList.push(location)
        setDestinations(newFinalList);
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Cerca un posto..."
                    className="name-field"
                />
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
            </div>
            <ul className='suggestions'>
                {destinations.map((data, index) => (
                    <li key={index} className='data'>{data}</li>
                ))}
            </ul>
        </div>
    );
};

export default AddList;

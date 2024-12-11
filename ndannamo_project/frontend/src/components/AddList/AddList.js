import React, { useState } from "react";
import {BsPlus} from 'react-icons/bs';
import './AddList.css'

function AddList({destinations, setDestinations}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Lista delle località
    const locations = [
        "Parigi",
        "Parma",
        "Padova",
        "Palermo",
        "Londra",
        "Roma",
        "Madrid",
        "Barcellona",
        "Milano",
        "Firenze",
        "Perugia",
    ];

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
        const filteredSuggestions = locations.filter((location) => location.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Resetta i suggerimenti se il campo è vuoto
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

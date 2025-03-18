import "./TripSummary.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UndoConfirm from "../../../common/UndoConfirm";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";
import TripService from "../../../services/TripService";
import { useLocation } from 'react-router-dom';
import navigator_icon from "../../../static/svg/icons/navigator_arrow_icon.svg";
import globe from "../../../static/globe.png";
import CityService from "../../../services/CityService";


export default function DestinationSummary() {

    const [changeDestination, setChangeDestination] = useState(false);
    const [newDestination, setNewDestination] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState('');
    var locations = [];

    const handleEditDestination = () => {
        setNewDestination(tripInfo.locations);
        setChangeDestination(true);
    }
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
    // Per aggiungere searchTerm alla lista di destinazioni scelte (serve per quando premi invio/clicchi sul pulsante +)
    const addCitySearchTerm = () => {

        if (searchTerm.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (newDestination.includes(searchTerm.trim())) {
            setError('City already added!');
            return;
        }

        setError('');
        setNewDestination([...newDestination, searchTerm]);

        setSearchTerm("");
    };
    // Per quando premi invio
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.trim()) {
                addCitySearchTerm();
            }
        }
    };
    // Per aggiungere la citta' passata in input alla lista di destinazioni scelte (serve per quando scegli un suggerimento)
    const addCity = (cityToAdd) => {
        console.log("cityToAdd: " + cityToAdd);

        if (cityToAdd.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (newDestination.includes(cityToAdd.trim())) {
            setError('City already added!');
            return;
        }

        setError('');
        setNewDestination([...newDestination, cityToAdd]);


        setSearchTerm("");
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

    const handleChangeDestination = async () => {
        if (newDestination === tripInfo.locations) {
            setChangeDestination(false);
        } else {
            if (newDestination) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate("/login");
                    }
                    const response = await TripService.updateDestination(token, tripInfo.id, newDestination);

                    if (response) {
                        setChangeDestination(false)
                        tripInfo.locations= newDestination;
                        navigate(`/trips/${tripInfo.id}/summary`, { state: { trip: tripInfo, profile: profileInfo } })
                        console.log("locations changed!")
                    } else {
                        console.error('Invalid response data');
                    }
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                }
            }
        }

    }
    // Per rimuovere una destinazione dalla lista di destinazioni scelte
    const removeCity = (index) => {
        setNewDestination(newDestination.filter((_, i) => i !== index));
        console.log(newDestination);
    };
    const handleSelect = (index) => {
        console.log("selected location: " + suggestions[index]);

        setSearchTerm("");
        setSuggestions([]);     // Nasconde i suggerimenti

        addCity(suggestions[index]);
    };
    function undoChangeDestination() {
        setChangeDestination(false);
        setSuggestions([]);
        setSearchTerm("");
    }
    function logVar(){
        console.log(newDestination);
    }

    return (
        <div className="mini-section" id="mini1">
            <div className="header-section" id="section2">
                <div className="icon-label">
                    <img src={navigator_icon} alt="navigator_icon" />
                    <p>Destinations</p>
                </div>
                {!changeDestination && tripInfo.creator &&
                    <img id="edit" className="editable" onClick={handleEditDestination} src={edit_icon} alt="edit_icon" />}
                {changeDestination && <UndoConfirm
                    onConfirm={handleChangeDestination}
                    onUndo={undoChangeDestination} />}
            </div>
            <div className="internal-section">
                <img id="globe" src={globe} alt="globe"/>
                {!changeDestination && <div className="destinations" id="1">
                    <div className="list-destination">
                        {tripInfo.locations.map((location, index) => (
                        <p key={index}>{location}</p>
                    ))}
                    </div>
                </div>}
                {changeDestination &&
                <div className="destinations">
                    <div className="list-destination">

                        {changeDestination && newDestination.map((location, index) => (
                            <li key={index}>
                                {location}
                                <button onClick={() => removeCity(index)}><i className="bi bi-x"></i></button>
                            </li>
                        ))}

                    </div>
                    <div id="input">
                        {changeDestination && false && <button onClick={logVar}> log </button>}
                        {changeDestination && <label>
                            <input
                                id="text-input"
                                type="text"
                                className='long-input'
                                value={searchTerm}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder='Type a destination'
                            />
                        </label>}
                        {suggestions.length > 0 && (
                            <div className='suggestions'>
                                <div className='suggestions-destination'>
                                    {suggestions.map((location, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelect(index)}
                                            className='data'
                                            onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                                        >
                                            <strong>{location.substring(0, document.getElementById("text-input").value.trim().length)}</strong>{location.substring(document.getElementById("text-input").value.trim().length)}
                                        </li>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
            </div>
        </div>
    );
}


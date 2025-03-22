import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import DateUtilities from '../../../utils/DateUtilities';
import CityService from '../../../services/CityService';

import { DateField } from '../../../components/Fields/Fields';


export default function EventOpenDatePlace({event, saveDateFunction, savePlaceFunction, reloadSchedule, tripStartDate, tripEndDate,
    canEditDate}) {

    // Questi parametri devono essere gli stessi anche nel backend, dentro EventValidation.java
    const PLACE_MAX_CHARACTERS = 60;

    const navigate = useNavigate();
    
    // Per modificare data
    const [editingDate, setEditingDate] = useState(false);
    const [newDate, setNewDate] = useState(event.date);

    const saveNewDate = async () => {
        // se non è cambiato niente, non fare nulla
        if (event.date === newDate) {
            setEditingDate(false);
            return;
        }

        try {
            // manda richiesta al server
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // cambia data nel backend
            const response = await saveDateFunction(token, event.tripId, event.id, newDate);
            console.log(newDate);

            if (response) {
                // aggiorna in locale
                event.date = newDate;
                setEditingDate(false);

                // ricarica la schedule a sinistra
                reloadSchedule(null, false, true);
            } 
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying date:', error);
            alert("Couldn't modify date: " + error.message);
        }
    }


    
    // Per modificare posto
    const [editingPlace, setEditingPlace] = useState(false);
    const [newPlace, setNewPlace] = useState(event.place);
    const [suggestions, setSuggestions] = useState([]);

    const saveNewPlace = async () => {
        // se non è cambiato niente, non fare nulla
        if (event.place === newPlace || newPlace.trim() === "") {
            setEditingPlace(false);
            return;
        }

        try {
            // manda richiesta al server
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // cambia posto nel backend
            const response = await savePlaceFunction(token, event.tripId, event.id, newPlace);
            //const response = "ok";
            console.log(newPlace);

            if (response) {
                // aggiorna in locale
                event.place = newPlace;
                setEditingPlace(false);

                // ricarica la schedule a sinistra
                reloadSchedule(null, false, false);
            } 
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying place:', error);
            alert("Couldn't modify place: " + error.message);
        }
    }

    // Quando inserisci delle lettere, per aggiornare i suggerimenti
    const handleInputChangePlace = async (event) => {

        // Limita numero di caratteri
        var input = event.target.value.substring(0, PLACE_MAX_CHARACTERS);

        setNewPlace(input);

        const input_trim = input.trim();

        // se ci sono meno di tre caratteri, resetta i suggerimenti
        if (input_trim.length < 3) {
            setSuggestions([]);
            return;
        }

        // ottieni suggerimenti dal server
        await updateLocationsFromServer(input_trim);
    };

    // Per richiedere al server tutte le citta' che iniziano con la stringa start
    const updateLocationsFromServer = async (start) => {
        try {
            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await CityService.getCitiesStartingWith(start);

            if (response) {
                //console.log(response);
                setSuggestions(response.map(city => city.name + ", " + city.country));
                
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Per quando clicchi su una destinazione dai suggerimenti
    const handleSelect = (index) => {
        //console.log("selected location: " + suggestions[index]);

        setSuggestions([]);     // Nasconde i suggerimenti
        setNewPlace(suggestions[index]);
    };


    // Per quando stai modificando qualcosa e premi invio
    const handleKeyDown = (e, saveFunction) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveFunction();
        }
    };


    return (
        <div className='flex-row date-place'>
            {/* Se non stai modificando la data o se non la puoi modificare (per le notti) */}
            {(!editingDate || !canEditDate) ? (
                <div className={(canEditDate) ? 'date flex-row hidden-btn-parent' : 'date flex-row hidden-btn-parent margin-right'}>
                    {/* Data */}
                    {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(event.date)}
                    {/* Pulsante per modificare la data */}
                    {canEditDate &&
                        <button onClick={() => {setNewDate(event.date);setEditingDate(true);}} title='Edit date'
                        className='no-background no-border flex-column hidden-btn'>
                            <i className="bi bi-pencil-fill h6 gray-icon spaced margin-bottom"/>
                        </button>
                    }
                </div>
            ) : (
                <div className='date flex-row'>
                    {/* Campo dove modificare la data*/}
                    <DateField value={newDate} setValue={setNewDate} name="" minDate={tripStartDate}
                    maxDate={tripEndDate} style={{flex: "2"}}/>
                    {/* Pulsante per salvare la data */}
                    <button onClick={saveNewDate} title='Save' className='no-background no-border flex-column'>
                        <i className="bi bi-floppy-fill h6 gray-icon spaced margin-bottom"/>
                    </button>
                </div>
            )}
            -
            {!editingPlace ? (
                <div className='place flex-row hidden-btn-parent'>
                    {/* Posto */}
                    {event.place}
                    {/* Pulsante per modificare il posto */}
                    <button onClick={() => {setNewPlace(event.place);setEditingPlace(true);}} title='Edit place'
                    className='no-background no-border flex-column hidden-btn'>
                        <i className="bi bi-pencil-fill h6 gray-icon spaced"/>
                    </button>
                </div>
            ) : (
                <div className='place'>
                    <div className='flex-row'> 
                        {/* Campo editabile dove modificare il posto */}
                        <input type="text" 
                            id="edit-place-input"
                            className="edit-place-input"
                            value={newPlace}
                            onChange={(e) => {handleInputChangePlace(e);}}
                            onKeyDown={(e) => {handleKeyDown(e, saveNewPlace);}}/>
                        {/* Pulsante per salvare il posto */}
                        <button onClick={saveNewPlace} title='Save' className='no-background no-border flex-column'>
                            <i className="bi bi-floppy-fill h6 gray-icon spaced"/>
                        </button>
                    </div>
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
                                    <strong>{location.substring(0,document.getElementById("edit-place-input").value.trim().length)}</strong>
                                    {location.substring(document.getElementById("edit-place-input").value.trim().length)}
                                </li>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
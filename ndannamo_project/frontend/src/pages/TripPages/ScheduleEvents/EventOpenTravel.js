import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import ScheduleService from '../../../services/ScheduleService';

import '../TripSchedule.css'

export default function EventOpenTravel({travel, latitude, longitude, reloadSchedule}) {

    const INFO_MAX_CHARACTERS = 500;

    const navigate = useNavigate();


    // Per eliminare il travel
    const deleteTravel = async () => {
        // disabilita pulsante per eliminare, altrimenti uno puo' ri-cliccarlo mentre gia' sta eliminando
        document.getElementById("delete-button").disabled = true;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            
            const response = await ScheduleService.deleteTravel(token, travel.tripId, travel.id);

            if (response) {
                // Ricarica la schedule a sinistra
                reloadSchedule(null, true, true);
            } else {
                console.error('Invalid response data');
                document.getElementById("delete-button").disabled = false;  // se non sei riuscito a eliminare l'attivita' ri-abilita il pulsante
            }
        } catch (error) {
            console.error('Error deleting travel:', error);
            document.getElementById("delete-button").disabled = false;  // se non sei riuscito a eliminare l'attivita' ri-abilita il pulsante
        }
    }




    // Per modificare info
    const [editingInfo, setEditingInfo] = useState(false);
    const [newInfo, setNewInfo] = useState(travel.info);

    const saveNewInfo = async () => {
        // se non è cambiato niente, non fare nulla
        if (travel.info == newInfo) {
            setEditingInfo(false);
            return;
        }
        
        // manda richiesta al server
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
    
            // cambia le info nel backend
            const response = await ScheduleService.changeTravelInfo(token, travel.tripId, travel.id, newInfo);
    
            if (response) {
                // aggiorna in locale
                travel.info = newInfo;
                setEditingInfo(false);
        
                // ricarica la schedule a sinistra
                reloadSchedule(null, false, false);
            }
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying info:', error);
            alert("Couldn't modify info: " + error.message);
        }
    }





    /********* Roba condivisa da tutte le funzioni di editing di un campo *********/

    // Per quando scrivi qualcosa in un campo editabile
    const handleInputChange = (event, allowWhiteSpaces, maxCharacters, setFunction) => {
        var input = event.target.value;

        if (!allowWhiteSpaces) {
            input = input.replaceAll(" ", "");
        }
        
        // Limita numero di caratteri
        input = input.substring(0, maxCharacters);
        
        setFunction(input);
    }

    // Per quando stai modificando qualcosa e premi invio
    const handleKeyDown = (e, saveFunction) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveFunction();
        }
    };


    return (
        <div id="event-open">
            <div className='top-row'>
            <button onClick={deleteTravel} id="delete-button" title='Delete travel' className='float-right no-background no-border delete-button'><i className="bi bi-trash3-fill h5"/></button>
                <div className='date'>
                    {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(travel.date)}
                </div>
                <div className='title'>
                    Travel to {travel.destination.split(",")[0]}
                </div>
            </div>
            
            <div className="map-banner">
                <Map latitude={latitude} longitude={longitude} message={travel.address}/>
            </div>

            <div className='event-info'>
                <div className='event-info-top-row'>
                    <div className='row-element'>
                        <div className='label'>Address</div>
                        <div className='value'>{travel.address}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Departure</div>
                        <div className='value'>{travel.startTime}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Arrival</div>
                        <div className='value'>{travel.endTime}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Weather</div>
                        <div className='value'>Not available</div>
                    </div>
                </div>

                {!editingInfo ? (
                    <div className='event-info-other'>
                        {/* Pulsante per modificare le info */}
                        <button onClick={() => {setNewInfo(travel.info);setEditingInfo(true);}} title='Edit info' className='float-right no-background no-border'>
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        {/* Info */}
                        <div className='info-content'>{travel.info}</div>
                    </div>
                ) : (
                    <div className='event-info-other'>
                        {/* Campo editabile dove modificare le info */}
                        <textarea 
                            className="edit-info-input"
                            value={newInfo}
                            onChange={(e) => {handleInputChange(e, true, INFO_MAX_CHARACTERS, setNewInfo);}}
                            onKeyDown={(e) => {handleKeyDown(e, saveNewInfo);}}/>
                        {/* Pulsante per salvare le info */}
                        <button onClick={saveNewInfo} title='Save' className='float-right no-background no-border'>
                            <i className="bi bi-floppy-fill"></i>
                        </button>
                    </div>
                )}

                <div className='attachments'>
                    <div className='label'>Tickets</div>
                </div>
            </div>
        </div>
    );

}
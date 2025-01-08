import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import ScheduleService from '../../../services/ScheduleService';

import '../TripSchedule.css'

export default function EventOpenActivity({activity, latitude, longitude}) {

    const INFO_MAX_CHARACTERS = 500;

    const navigate = useNavigate();

    // Per modificare info
    const [editingInfo, setEditingInfo] = useState(false);
    const [newInfo, setNewInfo] = useState(activity.info);

    const saveNewInfo = () => {
        // se non è cambiato niente, non fare nulla
        if (activity.info == newInfo) {
            setEditingInfo(false);
            return;
        }

        // manda richiesta al server
        const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
        if (!token) {
            navigate("/login");
        }

        // Chiamata al servizio per ottenere le informazioni del profilo
        ScheduleService.changeActivityInfo(token, activity.tripId, activity.id, newInfo);

        // aggiorna in locale
        activity.info = newInfo;
        setEditingInfo(false);
    }



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
                <div className='date'>
                    {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(activity.date)}
                </div>
                <div className='title'>
                    {activity.name}
                </div>
            </div>
            
            <div className="map-banner">
                <Map latitude={latitude} longitude={longitude} message={activity.address}/>
            </div>

            <div className='event-info'>
                <div className='event-info-top-row'>
                    <div className='row-element'>
                        <div className='label'>Address</div>
                        <div className='value'>{activity.address}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Time</div>
                        <div className='value'>{activity.startTime}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>End</div>
                        <div className='value'>{activity.endTime}</div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Weather</div>
                        <div className='value'>Not available</div>
                    </div>
                </div>
                <div className='event-info-other'>
                    {!editingInfo && <button onClick={() => {setNewInfo(activity.info);setEditingInfo(true);}} className='edit-info-button'><i className="bi bi-pencil-fill"></i></button>}
                    {!editingInfo && <div className='info-content'>{activity.info}</div>}
                    {editingInfo && <textarea 
                                        className="edit-info-input"
                                        value={newInfo}
                                        onChange={(e) => {handleInputChange(e, true, INFO_MAX_CHARACTERS, setNewInfo);}}
                                        onKeyDown={(e) => {handleKeyDown(e, saveNewInfo);}}/>}
                    {editingInfo && <button onClick={saveNewInfo} className='edit-info-button'><i className="bi bi-floppy-fill"></i></button>}
                </div>
                <div className='attachments'>
                    <div className='label'>Attachments</div>
                </div>
            </div>
        </div>
    );

}
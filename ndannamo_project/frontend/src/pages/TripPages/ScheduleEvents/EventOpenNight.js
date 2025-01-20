import React, {useEffect, useState} from 'react';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import '../TripSchedule.css'

export default function EventOpenNight({night, latitude, longitude, reloadSchedule, openCreateAccomodationModal, openEditAccomodationModal}) {


    // Se non c'e' una accomodation per questa notte, mostra il pulsante per crearne una
    if (night.overnightStay == null) {

        return (
            <div id="event-open">
                <div className='top-row'>
                    <div className='date'>
                        {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(night.date)}
                    </div>
                </div>
                <div className='no-selected-events flex-column align-items-center'>
                    You don't have an accomodation for this night
                    <button onClick={()=> {openCreateAccomodationModal(night.date)}}>Add accomodation</button>
                </div>
            </div>
        );
    }
    

    // Se c'e' un'accomodation, mostra le info e il pulsante per modificarla
    else {
        return (
            <div id="event-open">
                <div className='top-row'>
                    <div className='date'>
                        {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(night.date)}
                    </div>
                    <div className='title'>
                        Stay at {night.overnightStay.name}
                    </div>
                </div>
                
                <div className="map-banner">
                    <Map latitude={latitude} longitude={longitude} message={"Accomodation"}/>
                </div>
                
                <div className='event-info'>
                    <div className='event-info-top-row'>
                        <div className='row-element'>
                            <div className='label'>Address</div>
                            <div className='value'>
                                {night.overnightStay.address}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Check-in</div>
                            <div className='value'>
                                {night.overnightStay.startCheckInTime + " - " + night.overnightStay.endCheckInTime}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                        <div className='label'>Check-out</div>
                            <div className='value'>
                                {night.overnightStay.startCheckOutTime + " - " + night.overnightStay.startCheckOutTime}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Contacts</div>
                            <div className='value'>
                                {night.overnightStay.contact}{!night.overnightStay && "-"}
                            </div>
                        </div>
                    </div>
                    <div className='attachments'>
                        <div className='label'>Attachments</div>
                    </div>
                </div>
            </div>
        );
    }
}
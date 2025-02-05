import React, {useEffect, useState} from 'react';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import ScheduleService from '../../../services/ScheduleService';

import EventOpenDatePlace from './EventOpenDatePlace';

import '../TripSchedule.css';
import '../../../styles/Common.css';


export default function EventOpenNight({night, latitude, longitude, reloadSchedule, openCreateAccomodationModal, openEditAccomodationModal,
    tripStartDate, tripEndDate}) {


    // Se non c'e' una accomodation per questa notte, mostra il pulsante per crearne una
    if (night.overnightStay == null) {

        return (
            <div id="event-open">
                <div className='top-row'>
                    <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                        savePlaceFunction={ScheduleService.changeNightPlace} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                        canEditDate={false}/>
                </div>
                <div className='no-selected-events flex-column align-items-center'>
                    <p>You don't have an accomodation for this night</p>
                    <button className='custom-button' onClick={()=> {openCreateAccomodationModal(night.id, night.date)}}>Create</button>
                </div>
            </div>
        );
    }
    

    // Se c'e' un'accomodation, mostra le info e il pulsante per modificarla
    else {

        const overnightStay = night.overnightStay;

        // Componi le stringhe del check-in time e check-out time
        var checkInTime = "";
        var checkOutTime = "";

        if (overnightStay.startCheckInTime != null && overnightStay.endCheckInTime != null) {
            checkInTime = overnightStay.startCheckInTime + " - " + overnightStay.endCheckInTime;
        }
        else if (overnightStay.startCheckInTime != null) {
            checkInTime = "From " + overnightStay.startCheckInTime
        }
        else if (overnightStay.endCheckInTime != null) {
            checkInTime = "Until " + overnightStay.endCheckInTime
        }

        if (overnightStay.startCheckOutTime != null && overnightStay.endCheckOutTime != null) {
            checkOutTime = overnightStay.startCheckOutTime + " - " + overnightStay.endCheckOutTime;
        }
        else if (overnightStay.startCheckOutTime != null) {
            checkOutTime = "From " + overnightStay.startCheckOutTime
        }
        else if (overnightStay.endCheckOutTime != null) {
            checkOutTime = "Until " + overnightStay.endCheckOutTime
        }


        return (
            <div id="event-open">
                <div className='top-row'>
                    {/* Pulsante per modificare l'accomodation */}
                    <button onClick={()=>{openEditAccomodationModal(night.id, overnightStay)}} title='Edit accomodation'
                    className='float-right no-background no-border top-row-button'><i className="bi bi-pencil-fill h5 gray-icon"/></button>

                    <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                    savePlaceFunction={ScheduleService.changeNightPlace} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                    canEditDate={false}/>

                    <div className='title'>
                        Stay at "{overnightStay.name}"
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
                                {overnightStay.address}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Check-in</div>
                            <div className='value'>
                                {checkInTime}
                            </div>
                        </div>
                        <div className='row-element'>
                        <div className='label'>Check-out</div>
                            <div className='value'>
                                {checkOutTime}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Contacts</div>
                            <div className='value'>
                                {overnightStay.contact}
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
import React, {useEffect, useState} from 'react';

import EventOpenNight from './EventOpenNight';
import EventOpenActivity from './EventOpenActivity';
import EventOpenTravel from './EventOpenTravel';

import '../TripSchedule.css'
import '../../../styles/Common.css';

export default function EventOpen({event, latitude, longitude, reloadSchedule, openCreateAccomodationModal, openEditAccomodationModal,
    tripStartDate, tripEndDate}) {

    return (
        <div style={{width: "100%", height: "100%"}}>
            {(!event) && 
            <div id="event-open">
                <div className='no-selected-events'>Select an event on the left</div>
            </div>}
            {(event && event.constructor.name === "Night") && <EventOpenNight night={event} latitude={latitude} longitude={longitude}
            reloadSchedule={reloadSchedule} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
             openCreateAccomodationModal={openCreateAccomodationModal} openEditAccomodationModal={openEditAccomodationModal}/>}
            {(event && event.constructor.name === "Activity") && <EventOpenActivity activity={event} latitude={latitude} longitude={longitude}
            reloadSchedule={reloadSchedule} tripStartDate={tripStartDate} tripEndDate={tripEndDate}/>}
            {(event && event.constructor.name === "Travel") && <EventOpenTravel travel={event} latitude={latitude} longitude={longitude}
            reloadSchedule={reloadSchedule} tripStartDate={tripStartDate} tripEndDate={tripEndDate}/>}
        </div>
    );

}
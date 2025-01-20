import React, {useEffect, useState} from 'react';

import EventOpenNight from './EventOpenNight';
import EventOpenActivity from './EventOpenActivity';
import EventOpenTravel from './EventOpenTravel';

import '../TripSchedule.css'

export default function EventOpen({event, latitude, longitude, reloadSchedule, openCreateAccomodationModal, openEditAccomodationModal}) {

    return (
        <div style={{width: "100%", height: "100%"}}>
            {(!event) && <div className='no-selected-events'>Select an event on the left</div>}
            {(event && event.constructor.name === "Night") && <EventOpenNight night={event} latitude={latitude} longitude={longitude} reloadSchedule={reloadSchedule}
             openCreateAccomodationModal={openCreateAccomodationModal} openEditAccomodationModal={openEditAccomodationModal}/>}
            {(event && event.constructor.name === "Activity") && <EventOpenActivity activity={event} latitude={latitude} longitude={longitude} reloadSchedule={reloadSchedule}/>}
            {(event && event.constructor.name === "Travel") && <EventOpenTravel travel={event} latitude={latitude} longitude={longitude} reloadSchedule={reloadSchedule}/>}
        </div>
    );

}
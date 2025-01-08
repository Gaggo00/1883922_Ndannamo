import React, {useEffect, useState} from 'react';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import '../TripSchedule.css'

export default function EventOpenTravel({travel, latitude, longitude, reloadSchedule}) {

    return (
        <div id="event-open">
            <div className='top-row'>
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
                <div className='event-info-other'>
                    {travel.info}
                </div>
                <div className='attachments'>
                    <div className='label'>Tickets</div>
                </div>
            </div>
        </div>
    );

}
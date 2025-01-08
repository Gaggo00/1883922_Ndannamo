import React, {useEffect, useState} from 'react';

import Map from './Map';
import MapService from '../../../services/MapService';

import DateUtilities from '../../../utils/DateUtilities';

import '../TripSchedule.css'

export default function EventOpen({event, latitude, longitude}) {


    const showNight = (night) => {
        return (
            <div id="event-open">
                <div className='top-row'>
                    <div className='date'>
                        {DateUtilities.yyyymmdd_To_WEEKDAYddMONTH(night.date)}
                    </div>
                    <div className='title'>
                        Stay at {night.overnightStay && night.overnightStay.name}{!night.overnightStay && "?"}
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
                                {night.overnightStay && night.overnightStay.address}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Check-in</div>
                            <div className='value'>
                                {night.overnightStay && night.overnightStay.startCheckInTime + " - " + night.overnightStay.endCheckInTime}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                        <div className='label'>Check-out</div>
                            <div className='value'>
                                {night.overnightStay && night.overnightStay.startCheckOutTime + " - " + night.overnightStay.startCheckOutTime}{!night.overnightStay && "-"}
                            </div>
                        </div>
                        <div className='row-element'>
                            <div className='label'>Contacts</div>
                            <div className='value'>
                                {night.overnightStay && night.overnightStay.contact}{!night.overnightStay && "-"}
                            </div>
                        </div>
                    </div>
                    <div className='attachments'>
                        <div className='label'>Attachments</div>
                    </div>
                </div>
            </div>
        )
    }

    const showActivity = (activity) => {
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
                        {activity.info}
                    </div>
                    <div className='attachments'>
                        <div className='label'>Attachments</div>
                    </div>
                </div>
            </div>
        )
    }

    const showTravel = (travel) => {
        
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
        )
    }


    return (
        <div style={{width: "100%", height: "100%"}}>
            {(!event) && <div>Select an event on the left</div>}
            {(event && event.constructor.name === "Night") && showNight(event)}
            {(event && event.constructor.name === "Activity") && showActivity(event)}
            {(event && event.constructor.name === "Travel") && showTravel(event)}
        </div>
    );

}

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import EventClosedNight from "./EventClosedNight";
import EventClosedActivity from "./EventClosedActivity";
import EventClosedTravel from "./EventClosedTravel";

import ScheduleService from "../../../services/ScheduleService";
import DateUtilities from '../../../utils/DateUtilities';


export default function ScheduleDay({day, selectEvent, reloadSchedule}) {

    const navigate = useNavigate();

    const createActivity = async (previousEventTime) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            
            const tripId = day.tripId;
            const name = "New activity";
            const place = day.mainPlace;
            const date = day.date;
            const address = "";
            const info = "Write some info here...";
            const startTime = addMinutes(previousEventTime, 5);
            const endTime = null;

            const activityId = await ScheduleService.createActivity(token, tripId, place, date, name, startTime, endTime, address, info);

            if (activityId) {
                // Ricarica la schedule a sinistra e seleziona la nuova attivita'
                reloadSchedule(activityId, false, true);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    }

    const createTravel = async (previousEventTime) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            
            const tripId = day.tripId;
            const place = day.mainPlace;
            const date = day.date;
            const address = "";
            const destination = "?";
            const arrivalDate = date;
            const departureTime = addMinutes(previousEventTime, 5);
            const arrivalTime = departureTime;
            const info = "Write some info here...";

            const travelId = await ScheduleService.createTravel(token, tripId, place, date, address, destination, arrivalDate, departureTime, arrivalTime, info);

            if (travelId) {
                // Ricarica la schedule a sinistra e seleziona la nuova attivita'
                reloadSchedule(travelId, false, true);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error creating travel:', error);
        }
    }
    

    const addMinutes = (time, minsToAdd) => {
        const currentDate = new Date("1970/01/01 " + time);
        const newDate = new Date(currentDate.getTime() + minsToAdd * 60000);
        return newDate.toLocaleTimeString('en-UK', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }


    return (
        <div className="day">
            <div className="day-date">{DateUtilities.yyyymmdd_To_ddMONTH(day.date)}</div>
            <div className="hidden-button-parent">
                <button className="hidden-button" title='New activity' onClick={()=>{createActivity("4:55")}}><i className="bi bi-plus-lg h4"></i></button>
                <button className="hidden-button" title='New travel' onClick={()=>{createTravel("4:55")}}><i className="bi bi-airplane h4"></i></button>
            </div>
            {day.activitiesAndTravels.map((event, index) => {
                    if (event.constructor.name === "Activity") {
                        return <div key={index}> 
                            <EventClosedActivity activity={event} selectEvent={selectEvent}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" title='New activity' onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" title='New travel' onClick={()=>{createTravel(event.startTime)}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                    else if (event.constructor.name === "Travel") {
                        return <div key={index}>
                            <EventClosedTravel travel={event} selectEvent={selectEvent}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" title='New activity' onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" title='New travel' onClick={()=>{createTravel(event.startTime)}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                    return <div/>
                })
            }
            {day.night && <EventClosedNight night={day.night} selectEvent={selectEvent}/>}
        </div>
    );

}
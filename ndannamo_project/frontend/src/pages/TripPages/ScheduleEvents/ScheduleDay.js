
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import NightEvent from "./NightEvent";
import ActivityEvent from "./ActivityEvent";
import TravelEvent from "./TravelEvent";

import ScheduleService from "../../../services/ScheduleService";
import DateUtilities from '../../../utils/DateUtilities';


export default function ScheduleDay({day, selectEvent, openCreateEventForm, reloadSchedule}) {

    const navigate = useNavigate();

    const createActivity = async (previousEventTime) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            
            const tripId = day.tripId;
            const name = "New activity";
            var place = "Choose a place";
            if (day.night) {
                place = day.night.place;
            }
            const date = day.date;
            const address = "";
            const info = "Write some info here...";
            const minsToAdd = 5;
            const startTime = new Date(new Date("1970/01/01 " + previousEventTime).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
            const endTime = null;

            const activityId = await ScheduleService.createActivity(token, tripId, place, date, name, startTime, endTime, address, info);

            if (activityId) {
                // Ricarica la schedule a sinistra e seleziona la nuova attivita'
                reloadSchedule(activityId);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    }

    const createTravel = async (place, previousEventTime) => {
        openCreateEventForm();
    }
    

    return (
        <div className="day">
            <div className="day-date">{DateUtilities.yyyymmdd_To_ddMONTH(day.date)}</div>
            <div className="hidden-button-parent">
                <button className="hidden-button" onClick={()=>{createActivity("05:00")}}><i className="bi bi-plus-lg h4"></i></button>
                <button className="hidden-button" onClick={()=>{createTravel("04:55")}}><i className="bi bi-airplane h4"></i></button>
            </div>
            {day.activitiesAndTravels.map((event, index) => {
                    if (event.constructor.name === "Activity") {
                        return <div key={index}> 
                            <ActivityEvent activity={event} selectEvent={selectEvent}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" onClick={()=>{createTravel(event.startTime)}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                    else if (event.constructor.name === "Travel") {
                        return <div key={index}>
                            <TravelEvent travel={event} selectEvent={selectEvent}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" onClick={()=>{createTravel(event.startTime)}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                    return <div/>
                })
            }
            {day.night && <NightEvent night={day.night} selectEvent={selectEvent}/>}
        </div>
    );

}
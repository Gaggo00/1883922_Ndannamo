import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TripService from "../../services/TripService";
import ScheduleService from '../../services/ScheduleService';
import InternalMenu from "./InternalMenu";
import ScheduleDay from "./ScheduleEvents/ScheduleDay"
import DateUtilities from '../../utils/DateUtilities';

import './InternalMenu.css'
import './TripSchedule.css'

class Event {
    constructor(id, place, date) {
        this.id = id;
        this.place = place;
        this.date = date;
    }
}
class Night extends Event {
    constructor(id, place, date, overnightStay) {
        super(id, place, date);
        this.overnightStay = overnightStay;
    }
}
class ActivityAndTravel extends Event {
    constructor(id, place, date, address, startTime, endTime) {
        super(id, place, date);
        this.address = address;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
class Activity extends ActivityAndTravel {
    constructor(id, place, date, address, startTime, endTime, name, info) {
        super(id, place, date, address, startTime, endTime);
        this.name = name;
        this.info = info;
    }
}
class Travel extends ActivityAndTravel {
    constructor(id, place, date, address, startTime, endTime, destination, arrivalDate) {
        super(id, place, date, address, startTime, endTime);
        this.destination = destination;
        this.arrivalDate = arrivalDate;
    }
}
class Day {
    constructor(date, activitiesAndTravels, night) {
        this.date = date;                                      // stringa tipo: "1 Ottobre"
        this.activitiesAndTravels = activitiesAndTravels;      // array di oggetti Activity e oggetti Travel  
        this.night = night;                                    // singolo oggetto Night
    }
}




export default function TripSchedule() {

    // Per il campo "type" negli elementi di schedule
    const NIGHT = "NIGHT";
    const ACTIVITY = "ACTIVITY";
    const TRAVEL = "TRAVEL";

    const { id } = useParams();
    const [tripInfo, setTripInfo] = useState({
        id:'',
        title: '',
        locations: [],
        creationDate:'',
        startDate : '',
        endDate : '',
        createdBy:'',
        list_participants: []
    });
    const [schedule, setSchedule] = useState( [
        {
            type: "",
            id: null,
            place: "",
            date: "",
            destination: "",
            arrivalDate: "",
            address: "",
            startTime: "",
            endTime: "",
            name: "",
            info: "",
            overnightStay: {
                id: null,
                startDate: "",
                endDate: "",
                startCheckInTime: "",
                endCheckInTime: "",
                startCheckOutTime: "",
                endCheckOutTime: "",
                address: "",
                contact: "",
                name: ""
            }
        }
    ]);
    const [tripDays, setTripDays] = useState([]);   // Array di oggetti "Day" (classe definita sopra)

    const navigate = useNavigate();

    useEffect(() => {
        fetchTripInfo();
    }, []);

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(token, id);

            if (response) {
                setTripInfo(response);

                // NOTA PER GAVRIEL: se levi la funzione fetchTripInfo bisogna comunque eseguire questo codice da qualche parte:
                fetchSchedule(response.startDate, response.endDate);

            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const fetchSchedule = async (startDate, endDate) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            const response = await ScheduleService.getSchedule(token, id);

            if (response) {
                setSchedule(response);

                setTripDays(createTripDays(response, startDate, endDate));
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };


    // startDate e endDate devono essere nel formato "yyyy-mm-dd"
    const createTripDays = (schedule, startDate, endDate) => {
        let howManyDays = DateUtilities.daysBetween(startDate, endDate) + 1;   // +1 perche' includiamo sia il primo giorno che l'ultimo
        
        // Array da restituire
        var days = [];
        
        // Inizializza array "days" con le date, poi riempio gli altri campi dopo
        var currentDay = startDate;
        for (var i=0; i<howManyDays; i++) {
            var dateString = DateUtilities.yyyymmdd_To_ddMONTH(currentDay);
            days.push(new Day(dateString, [], null));
            currentDay = DateUtilities.getNextDay(currentDay);
        }

        // Itera gli eventi e assegnali alle date giuste dentro l'array "days"
        schedule.forEach(event => {
            // Indice di questo evento nell'array "days", e' uguale alla distanza della data dell'evento da startDate
            const index = DateUtilities.daysBetween(startDate, event.date);

            if (event.type == NIGHT) {
                const night = new Night(event.id, event.place, event.date, event.overnightStay);     // DA SISTEMARE overnightStay forse
                days[index].night = night;
            }
            else if (event.type == ACTIVITY) {
                const activity = new Activity(event.id, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.name, event.info
                );
                console.log(activity.address);
                days[index].activitiesAndTravels.push(activity);
            }
            else if (event.type == TRAVEL) {
                const travel = new Travel(event.id, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.destination, event.arrivalDate
                );
                days[index].activitiesAndTravels.push(travel);
            }
            
        });

        const compareEventsByTime = (event1, event2) => {
            if ( event1.startTime < event2.startTime ){
                return -1;
              }
              if ( event1.startTime > event2.startTime ){
                return 1;
              }
              return 0;
        }

        // Ordina tutti gli array activitiesAndTravels in base allo startTime
        days.forEach(day => {
            day.activitiesAndTravels.sort(compareEventsByTime);
        });

        return days;
    }


    return (
        <div className="trip-info">
            <InternalMenu/>
            <div className="trip-content">
                <div className="trip-top">
                    <span> <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}</span>
                </div>
                <div className="trip-details schedule-section">
                    <div id="schedule">
                        <div id="calendar">
                            Qui metteremo il calendario
                        </div>
                        <div id="events">
                            {tripDays.map((day, index) =>
                                <ScheduleDay key={index} day={day}></ScheduleDay>
                            )}
                        </div>
                    </div>
                    <div id="event-info"></div>
                </div>
            </div>
        </div>
    );
}

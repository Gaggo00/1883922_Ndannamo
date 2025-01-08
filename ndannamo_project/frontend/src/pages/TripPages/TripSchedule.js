import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import TripService from "../../services/TripService";
import ScheduleService from '../../services/ScheduleService';
import MapService from '../../services/MapService';

import InternalMenu from "./InternalMenu";
import ScheduleDay from "./ScheduleEvents/ScheduleDay"
import CreateEventForm from './ScheduleEvents/CreateEventForm';
import EventOpen from './ScheduleEvents/EventOpen';

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
    constructor(id, place, date, address, startTime, endTime, info) {
        super(id, place, date);
        this.address = address;
        this.startTime = startTime;
        this.endTime = endTime;
        this.info = info;
    }
}
class Activity extends ActivityAndTravel {
    constructor(id, place, date, address, startTime, endTime, info, name) {
        super(id, place, date, address, startTime, endTime, info);
        this.name = name;

    }
}
class Travel extends ActivityAndTravel {
    constructor(id, place, date, address, startTime, endTime, info, destination, arrivalDate) {
        super(id, place, date, address, startTime, endTime, info);
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


    // Per gestire il pop-up da cui creare nuovi activity/travel
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            closeModal();
        }
    };


    // Per gestire la selezione di un evento
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventLatitude, setSelectedEventLatitude] = useState("");
    const [selectedEventLongitude, setSelectedEventLongitude] = useState("");


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
    // Struttura elementi EventDTO ricevuti dal backend
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

                // NOTA PER GAVRIEL: se levi la funzione fetchTripInfo bisogna comunque eseguire fetchSchedule da qualche parte, dopo aver ottenuto le info della trip:
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

            if (event.type === NIGHT) {
                const night = new Night(event.id, event.place, event.date, event.overnightStay);     // DA SISTEMARE overnightStay forse
                days[index].night = night;
            }
            else if (event.type === ACTIVITY) {
                const activity = new Activity(event.id, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.info, event.name
                );
                days[index].activitiesAndTravels.push(activity);
            }
            else if (event.type === TRAVEL) {
                const travel = new Travel(event.id, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.info, event.destination, event.arrivalDate
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


    const changeSelectedEvent = async (event) => {
        var coords = await fetchCoordinatesFromBackend(event);
        if (coords) {
            setSelectedEventLatitude(coords[0]);
            setSelectedEventLongitude(coords[1]);
        }
        setSelectedEvent(event);

        if (event.address && coords) {
            fetchCoordinatesFromExternalAPI(event.address + ", " + event.place, coords[0], coords[1], setSelectedEventLatitude, setSelectedEventLongitude);
        }
    }


    const fetchCoordinatesFromBackend = async (event) => {
        const placeArray = event.place.split(",");
        const city = placeArray[0].trim();
        var country = "";
        if (placeArray.length > 1) {
            country = placeArray[1].trim();
        }

        try {
            console.log(city, country);
            const response = await MapService.getCityCoordinates(city, country);

            if (response) {
                if (response !== "") {
                    return response.split(",");
                }
                else {
                    return ["", ""];
                }
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    }

    const fetchCoordinatesFromExternalAPI = async (address, cityLat, cityLon, setLat, setLon) => {
        console.log("fetching better coordinates");
        try {
            const response = await MapService.getCoordinates(address, cityLat, cityLon);

            if (response) {
                console.log(response);
                if (response[0]) setLat(response[0]);
                if (response[1]) setLon(response[1]);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    }


    return (
        <div className="trip-info">
            <InternalMenu/>
            <div className="trip-content">
                <div className="trip-top">
                    <span> <strong>{tripInfo.title}:</strong> {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.startDate)} - {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.endDate)}</span>
                </div>
                <div className="trip-details trip-details-schedule">
                    <div id="schedule">
                        <div id="calendar">
                            Qui metteremo il calendario
                        </div>
                        <div id="events">
                            {tripDays.map((day, index) =>
                                <ScheduleDay key={index} day={day} selectEvent={changeSelectedEvent} openCreateEventForm={openModal}/>
                            )}
                        </div>
                    </div>
                    <div id="event-info">
                        <EventOpen event={selectedEvent} latitude={selectedEventLatitude} longitude={selectedEventLongitude}/>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="new-event-box">
                        <CreateEventForm/>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import TripService from "../../services/TripService";
import ScheduleService from '../../services/ScheduleService';
import MapService from '../../services/MapService';

import InternalMenu from "./InternalMenu";
import ScheduleDay from "./ScheduleEvents/ScheduleDay"
import EventOpen from './ScheduleEvents/EventOpen';

import DateUtilities from '../../utils/DateUtilities';

import './InternalMenu.css'
import './TripSchedule.css'

class Event {
    constructor(id, tripId, place, date) {
        this.id = id;
        this.tripId = tripId;
        this.place = place;
        this.date = date;
    }
}
class Night extends Event {
    constructor(id, tripId, place, date, overnightStay) {
        super(id, tripId, place, date);
        this.overnightStay = overnightStay;
    }
}
class ActivityAndTravel extends Event {
    constructor(id, tripId, place, date, address, startTime, endTime, info) {
        super(id, tripId, place, date);
        this.address = address;
        this.startTime = startTime;
        this.endTime = endTime;
        this.info = info;
    }
}
class Activity extends ActivityAndTravel {
    constructor(id, tripId, place, date, address, startTime, endTime, info, name) {
        super(id, tripId, place, date, address, startTime, endTime, info);
        this.name = name;

    }
}
class Travel extends ActivityAndTravel {
    constructor(id, tripId, place, date, address, startTime, endTime, info, destination, arrivalDate) {
        super(id, tripId, place, date, address, startTime, endTime, info);
        this.destination = destination;
        this.arrivalDate = arrivalDate;
    }
}
class Day {
    constructor(tripId, date, activitiesAndTravels, night, mainPlace) {
        this.tripId = tripId;
        this.date = date;                                      // stringa tipo: "1 Ottobre"
        this.activitiesAndTravels = activitiesAndTravels;      // array di oggetti Activity e oggetti Travel  
        this.night = night;                                    // singolo oggetto Night
        this.mainPlace = mainPlace;                             // citta' della night, o citta' della night del giorno prima (se e' l'ultimo giorno)
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



    // Per ricaricare l'elenco a sinistra quando vengono modificati gli eventi
    const [seedSchedule, setSeedSchedule] = useState(1);

    const reloadScheduleOnLeft = async (eventToSelectId=null, deselectEvent=false, fetchFromBackend=true) => {
        if (deselectEvent) {
            setSelectedEvent(null);
        }
        if (fetchFromBackend) {
            await fetchSchedule(tripInfo.startDate, tripInfo.endDate, eventToSelectId);
        }
        setSeedSchedule(Math.random());
    }



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
            tripId: null,
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

    const fetchSchedule = async (startDate, endDate, eventToSelectId=null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            const response = await ScheduleService.getSchedule(token, id);

            if (response) {
                setSchedule(response);

                setTripDays(createTripDays(response, startDate, endDate, eventToSelectId));
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };


    // startDate e endDate devono essere nel formato "yyyy-mm-dd"
    const createTripDays = (schedule, startDate, endDate, eventToSelectId=null) => {
        let howManyDays = DateUtilities.daysBetween(startDate, endDate) + 1;   // +1 perche' includiamo sia il primo giorno che l'ultimo
        let tripId = schedule[0].tripId;

        // Array da restituire
        var days = [];
        
        // Inizializza array "days" con le date, poi riempio gli altri campi dopo
        var currentDay = startDate;
        for (var i=0; i<howManyDays; i++) {
            days.push(new Day(tripId, currentDay, [], null, "Place"));
            currentDay = DateUtilities.getNextDay(currentDay);
        }

        // Itera gli eventi e assegnali alle date giuste dentro l'array "days"
        schedule.forEach(event => {
            // Indice di questo evento nell'array "days", e' uguale alla distanza della data dell'evento da startDate
            const index = DateUtilities.daysBetween(startDate, event.date);

            if (event.type === NIGHT) {
                const night = new Night(event.id, event.tripId, event.place, event.date, event.overnightStay);     // DA SISTEMARE overnightStay forse
                days[index].night = night;
                days[index].mainPlace = night.place;
                if (event.id == eventToSelectId) {
                    changeSelectedEvent(night);
                }
            }
            else if (event.type === ACTIVITY) {
                const activity = new Activity(event.id, event.tripId, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.info, event.name
                );
                days[index].activitiesAndTravels.push(activity);
                if (event.id == eventToSelectId) {
                    changeSelectedEvent(activity);
                }
            }
            else if (event.type === TRAVEL) {
                const travel = new Travel(event.id, event.tripId, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.info, event.destination, event.arrivalDate
                );
                days[index].activitiesAndTravels.push(travel);
                if (event.id == eventToSelectId) {
                    changeSelectedEvent(travel);
                }
            }
            
        });

        // Imposta il posto dell'ultimo giorno, che non ha una notte, copiandolo dal giorno prima
        // (Prima assicurati che ci siano almeno due giorni, anche se dovrebbe essere sempre cosi')
        if (howManyDays > 1) {
            days[howManyDays-1].mainPlace = days[howManyDays-2].mainPlace;
        }

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
        if (!event.place) {
            return;
        }
        const placeArray = event.place.split(",");
        const city = placeArray[0].trim();
        var country = "";
        if (placeArray.length > 1) {
            country = placeArray[1].trim();
        }

        try {
            //console.log(city, country);
            const response = await MapService.getCityCoordinates(city, country);

            if (response) {
                if (response !== "") {
                    return response.split(",");
                }
                else {
                    return ["", ""];
                }
            } else {
                //console.error('Invalid response data');
                return null;
            }
        } catch (error) {
            //console.error('Error fetching coordinates:', error);
            return null;
        }
    }

    const fetchCoordinatesFromExternalAPI = async (address, cityLat, cityLon, setLat, setLon) => {
        //console.log("fetching better coordinates");
        try {
            const response = await MapService.getCoordinates(address, cityLat, cityLon);

            if (response) {
                //console.log(response);
                if (response[0]) setLat(response[0]);
                if (response[1]) setLon(response[1]);
            } else {
                //console.error('Invalid response data');
            }
        } catch (error) {
            //console.error('Error fetching coordinates:', error);
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
                    <div id="schedule" key={seedSchedule}>
                        <div id="calendar">
                            Qui metteremo il calendario
                        </div>
                        <div id="events">
                            {tripDays.map((day, index) =>
                                <ScheduleDay key={index} day={day} selectEvent={changeSelectedEvent} reloadSchedule={reloadScheduleOnLeft}/>
                            )}
                        </div>
                    </div>
                    <div id="event-info">
                        <EventOpen event={selectedEvent} latitude={selectedEventLatitude} longitude={selectedEventLongitude} reloadSchedule={reloadScheduleOnLeft}/>
                    </div>
                </div>
            </div>
            {/* Qui c'era il form pop-up per creare le activity/travel, l'ho rimosso. Pero' possiamo mettere qua sotto i messaggi di conferma
            prima di eliminare qualcosa */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="new-event-box">
                    </div>
                </div>
            )}
        </div>
    );
}

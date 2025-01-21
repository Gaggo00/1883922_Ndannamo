import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

import ScheduleService from '../../services/ScheduleService';
import MapService from '../../services/MapService';

import InternalMenu from "./InternalMenu";
import ScheduleDay from "./ScheduleEvents/ScheduleDay"
import EventOpen from './ScheduleEvents/EventOpen';
import OvernightStayForm from './ScheduleEvents/OvernightStayForm';

import Day from '../../models/Day';
import Night from '../../models/Night';
import Activity from '../../models/Activity';
import Travel from '../../models/Travel';
import OvernightStay from '../../models/OvernightStay';

import DateUtilities from '../../utils/DateUtilities';

import './InternalMenu.css'
import './TripSchedule.css'



export default function TripSchedule() {
    const { id } = useParams();
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato

    // Per il campo "type" negli elementi di schedule
    const NIGHT = "NIGHT";
    const ACTIVITY = "ACTIVITY";
    const TRAVEL = "TRAVEL";


    const [overnightStayForForm, setOvernightStayForForm] = useState(null);

    
    // Per il pop-up da cui creare/modificare un'accomodation (= OvernightStay nel backend)
    const [isAccomodationModalOpen, setIsAccomodationModalOpen] = useState(false);
    const [accomodationEditing, setAccomodationEditing] = useState(false);      // false quando crei un'overnight, true quando modifichi
    const [accomodationNightId, setAccomodationNightId] = useState(-1);

    const openCreateAccomodationModal = (nightId, date) => {

        // Campi per oggetto overnightStay
        const id = null;    // stiamo creando una nuova accomodation, non abbiamo l'id
        const name = "";
        const startDate = null;
        const endDate = null;
        const startCheckInTime = null;
        const endCheckInTime = null;
        const startCheckOutTime = null;
        const endCheckOutTime = null;
        const address = "";
        const contact = "";
        const overnightStay = new OvernightStay(id, name, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact);

        // Imposta use state
        setOvernightStayForForm(overnightStay);
        setAccomodationEditing(false);
        setAccomodationNightId(nightId);

        setIsAccomodationModalOpen(true);
    };

    // Per il pop-up da cui modificare un'accomodation (= OvernightStay nel backend)
    const openEditAccomodationModal = (nightId, overnightStay) => {

        setOvernightStayForForm(overnightStay);
        setAccomodationEditing(true);
        setAccomodationNightId(nightId);

        setIsAccomodationModalOpen(true);
    };

    const closeAccomodationModal = () => {
        setIsAccomodationModalOpen(false);
    };

    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            closeAccomodationModal();
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

    // Per ricaricare l'evento aperto quando apri un nuovo evento
    const [seedEventOpen, setSeedEventOpen] = useState(1);


    // Per gestire la selezione di un evento
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventLatitude, setSelectedEventLatitude] = useState("");
    const [selectedEventLongitude, setSelectedEventLongitude] = useState("");


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
        fetchSchedule(tripInfo.startDate, tripInfo.endDate);
    }, []);

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
                if (event.id === eventToSelectId) {
                    changeSelectedEvent(activity);
                }
            }
            else if (event.type === TRAVEL) {
                const travel = new Travel(event.id, event.tripId, event.place, event.date, event.address,
                    event.startTime, event.endTime, event.info, event.destination, event.arrivalDate
                );
                days[index].activitiesAndTravels.push(travel);
                if (event.id === eventToSelectId) {
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

        setSeedEventOpen(Math.random());

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


    // Per scrollare a un certo giorno, la data deve essere passata come "2025-01-21"
    const scrollToDay = (date) => {
        const id = "day-" +  date;
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    }

    return (
        <div className="trip-info">
            <InternalMenu />
            <div className="trip-content">
                <div className="trip-top">
                    <span> <strong>{tripInfo.title}:</strong> {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.startDate)} - {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.endDate)}</span>
                </div>
                <div className="trip-details trip-details-schedule">
                    <div id="schedule" key={seedSchedule}>
                        <div id="calendar">
                            Qui metteremo il calendario<br/>
                            <button onClick={() => scrollToDay("2025-01-25")}>scrolla a 25 gennaio (temporaneo)</button>
                        </div>
                        <div id="events">
                            {tripDays.map((day, index) =>
                                <ScheduleDay key={index} day={day} selectEvent={changeSelectedEvent} reloadSchedule={reloadScheduleOnLeft}/>
                            )}
                        </div>
                    </div>
                    <div id="event-info">
                        <EventOpen key={seedEventOpen} event={selectedEvent} latitude={selectedEventLatitude} longitude={selectedEventLongitude} reloadSchedule={reloadScheduleOnLeft}
                        openCreateAccomodationModal={openCreateAccomodationModal} openEditAccomodationModal={openEditAccomodationModal}/>
                    </div>
                </div>
            </div>
            {/* Pop up per creare/modificare una nuova accomodation */}
            {isAccomodationModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="new-event-box">
                        <OvernightStayForm tripId={id} tripStartDate={tripInfo.startDate} tripEndDate={tripInfo.endDate} editing={accomodationEditing}
                        overnightStay={overnightStayForForm} closeModal={closeAccomodationModal} reloadSchedule={reloadScheduleOnLeft}
                        nightId={accomodationNightId}/>
                    </div>
                </div>
            )}
        </div>
    );
}


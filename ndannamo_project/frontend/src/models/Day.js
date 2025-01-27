export default class Day {
    constructor(tripId, date, activitiesAndTravels, night, mainPlace) {
        this.tripId = tripId;
        this.date = date;                                      // stringa tipo: "1 Ottobre"
        this.activitiesAndTravels = activitiesAndTravels;      // array di oggetti Activity e oggetti Travel  
        this.night = night;                                    // singolo oggetto Night
        this.mainPlace = mainPlace;                             // citta' della night, o citta' della night del giorno prima (se e' l'ultimo giorno)
    }
}
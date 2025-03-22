import ActivityAndTravel from "./ActivityAndTravel";

export default class Travel extends ActivityAndTravel {
    constructor(id, tripId, place, date, address, startTime, endTime, info, destination, arrivalDate) {
        super(id, tripId, place, date, address, startTime, endTime, info);
        this.destination = destination;
        this.arrivalDate = arrivalDate;
    }
}
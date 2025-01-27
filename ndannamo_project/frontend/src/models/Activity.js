import ActivityAndTravel from "./ActivityAndTravel";

export default class Activity extends ActivityAndTravel {
    constructor(id, tripId, place, date, address, startTime, endTime, info, name) {
        super(id, tripId, place, date, address, startTime, endTime, info);
        this.name = name;

    }
}

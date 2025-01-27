import Event from "./Event";

export default class ActivityAndTravel extends Event {
    constructor(id, tripId, place, date, address, startTime, endTime, info) {
        super(id, tripId, place, date);
        this.address = address;
        this.startTime = startTime;
        this.endTime = endTime;
        this.info = info;
    }
}
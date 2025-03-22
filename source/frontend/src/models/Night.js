import Event from "./Event";

export default class Night extends Event {
    constructor(id, tripId, place, date, overnightStay) {
        super(id, tripId, place, date);
        this.overnightStay = overnightStay;
    }
}
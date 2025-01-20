export default class OvernightStay {
    constructor(id, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact, name) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startCheckInTime = startCheckInTime;
        this.endCheckInTime = endCheckInTime;
        this.startCheckOutTime = startCheckOutTime;
        this.endCheckOutTime = endCheckOutTime;
        this.address = address;
        this.contact = contact;
        this.name = name;
    }
}



export default class OvernightStay {
    constructor(id, name, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startCheckInTime = startCheckInTime;
        this.endCheckInTime = endCheckInTime;
        this.startCheckOutTime = startCheckOutTime;
        this.endCheckOutTime = endCheckOutTime;
        this.address = address;
        this.contact = contact;
    }
}



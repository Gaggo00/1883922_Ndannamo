export default class Trip {
    constructor(id, destination, start_timestamp, final_timestamp) {
        this.id = id
        this.destination = destination;
        this.startDate = new Date(start_timestamp);
        this.finalDate = new Date(final_timestamp);
    }

    getDestination() {
        return this.destination
    }

    getStartDate() {
        return this.startDate
    }

    getFinalDate() {
        return this.finalDate
    }

    getDuration() {
        return Math.round((this.finalDate - this.startDate) / (1000 * 60 * 60 * 24)); // Giorni
    }

    // 0: YYYY-MM-DD
    // 1: DD-MM-YYYY
    // 2: MM-DD-YYYY
    _dateToString(date, format = 0, separator = '/', yearB = false) {
        var dateStr = "";
        var day = date.getDate().toString().padStart(2, '0');
        var month = date.getMonth().toString().padStart(2, '0');
        var year = date.getFullYear().toString()

        if (format == 0) {
            dateStr = month + separator + day
            if (yearB)
                dateStr = year.concat(separator, dateStr)
        }
        else if (format == 1) {
            dateStr = day + separator + month
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        else {
            dateStr = month + separator + day
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        
        return dateStr
    }

    getStartDateStr(format = 0, separator = '/', yearB = false) {
        this._dateToString(this.startDate, format, separator, yearB)
    }

    getFinalDateStr(format = 0, separator = '/', yearB=false) {
        this._dateToString(this.finalDate, format, separator, yearB)
    }


    getDateStr(format = 0, separator = '/', yearB = false) {
        var date = this._dateToString(this.startDate, format, separator, yearB)
        date += '-' + this._dateToString(this.finalDate, format, separator, yearB)

        return date
    }

    // 0: upcoming
    // 1: current
    // 2: previous
    getStatus() {
        const current_date = Date.now()
        if (current_date <=  this.startDate)
            return 0
        else if (current_date > this.startDate && current_date < this.finalDate)
            return 1
        else
            return 2
    }
}

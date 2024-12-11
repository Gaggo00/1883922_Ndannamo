export default class DateHelper {

    static stringToDate_YYYY_MM_DD(dateStr, separator) {
        return Date.parse(dateStr + "T00:00:00.000Z");
    }
}
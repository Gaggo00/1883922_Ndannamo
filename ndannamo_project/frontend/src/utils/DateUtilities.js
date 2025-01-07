export default class DateUtilities {

    /***************** DA OGGETTO DATE A STRINGA *****************/

    // Esempio:
    // date_To_yyyymmdd(Date.now())
    // restituisce "2025-01-02"
    static date_To_yyyymmdd(date, separator="-") {
        var res = date.toISOString().split('T')[0];
        res = res.replaceAll("-", separator);
        return res;
    }

    // Esempio:
    // date_To_ddmmyyyy(Date.now(), "/")
    // restituisce "02/01/2025"
    static date_To_ddmmyyyy(date, separator) {
        var res = DateUtilities.yyyymmdd_To_ddmmyyyy(DateUtilities.date_To_yyyymmdd(date), "-", separator);
        console.log(res);
        return res;
    }

    // Esempio:
    // date_To_ddmmyy(Date.now(), "/")
    // restituisce "02/01/25"
    static date_To_ddmmyy(date, separator) {
        var res = DateUtilities.yyyymmdd_To_ddmmyy(DateUtilities.date_To_yyyymmdd(date), "-", separator);
        return res;
    }


    // Esempio:
    // date_To_ddmmyy(Date.now(), "/")
    // restituisce "02/01"
    static date_To_ddmm(date, separator) {
        var res = DateUtilities.yyyymmdd_To_ddmm(DateUtilities.date_To_yyyymmdd(date), "-", separator);
        return res;
    }




    /***************** DA STRINGA A STRINGA IN ALTRI FORMATI *****************/

    // Esempio:
    // yyyymmdd_To_ddmmyy("2019-05-13", "-", "/")
    // restituisce "13/05/19"
    static yyyymmdd_To_ddmmyy(date, oldSeparator, newSeparator) {
        var dateArray = date.split(oldSeparator);
        return dateArray[2] + newSeparator + dateArray[1] + newSeparator + dateArray[0].substring(2);
    }

    // Esempio:
    // yyyymmdd_To_ddmmyyyy("2020-05-13", "-", "/")
    // restituisce "13/05/2019"
    static yyyymmdd_To_ddmmyyyy(date, oldSeparator, newSeparator) {
        var dateArray = date.split(oldSeparator);
        return dateArray[2] + newSeparator + dateArray[1] + newSeparator + dateArray[0];
    }


    // Esempio:
    // yyyymmdd_To_ddmm("2020-05-13", "-", "/")
    // restituisce "13/05"
    static yyyymmdd_To_ddmm(date, oldSeparator, newSeparator) {
        var dateArray = date.split(oldSeparator);
        return dateArray[2] + newSeparator + dateArray[1];
    }


    // Esempio:
    // yyyymmdd_To_ddMONTHyyyy("2020-05-13")
    // restituisce "13 maggio 2020"
    static yyyymmdd_To_ddMONTHyyyy(date, oldSeparator="-") {
        var dateObject = new Date(date.replaceAll(oldSeparator, "-"));
        return dateObject.toLocaleString('default', {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }



    /***************** ALTRE OPERAZIONI SULLE DATE *****************/



    // Prende in input una stringa tipo "yyyy-mm-dd" e restituisce il giorno dopo nello stesso formato
    static getNextDay(day) {
        var nextDayDate = new Date(Date.parse(day) + (24 * 60 * 60 * 1000));
        var nextDay = nextDayDate.toISOString().split('T')[0];
        return nextDay;
    };

}
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
        const dateString = dateObject.toLocaleString('default', {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        // Metti al mese l'iniziale maiuscola
        const dateArray = dateString.split(" ");
        var month = dateArray[1];
        month = month.charAt(0).toUpperCase() + month.slice(1);
        return dateArray[0] + " " + month + " " + dateArray[2];
    }

    // Esempio:
    // yyyymmdd_To_ddMONTH("2020-05-13")
    // restituisce "13 maggio"
    static yyyymmdd_To_ddMONTH(date, oldSeparator="-") {
        var dateObject = new Date(date.replaceAll(oldSeparator, "-"));
        const dateString = dateObject.toLocaleString('default', {
            day: "numeric",
            month: "long"
        });
        // Metti al mese l'iniziale maiuscola
        const dateArray = dateString.split(" ");
        var month = dateArray[1];
        month = month.charAt(0).toUpperCase() + month.slice(1);
        return dateArray[0] + " " + month;
    }

    // Esempio:
    // yyyymmdd_To_ddMONTH("2020-05-13")
    // restituisce "13 maggio"
    static yyyymmdd_To_WEEKDAYddMONTH(date, oldSeparator="-") {
        var dateObject = new Date(date.replaceAll(oldSeparator, "-"));
        const dateString = dateObject.toLocaleString('default', {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
        // Metti al giorno della settimana e al mese l'iniziale maiuscola
        const dateArray = dateString.split(" ");
        var weekday = dateArray[0];
        weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        var month = dateArray[2];
        month = month.charAt(0).toUpperCase() + month.slice(1);
        return weekday + " " + dateArray[1] + " " + month;
    }



    /***************** ALTRE OPERAZIONI SULLE DATE *****************/


    // Prende in input due stringe tipo "yyyy-mm-dd" e dice la differenza in giorni tra le due date
    static daysBetween(startDate, endDate) {
        let date1 = new Date(startDate);
        let date2 = new Date(endDate);

        // Calcola la differenza in millisecondi
        let differenceInTime = date2.getTime() - date1.getTime();

        // Trasforma da differenza in millisecondi in differenza in giorni
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

        return differenceInDays;
    }


    // Prende in input una stringa tipo "yyyy-mm-dd" e restituisce il giorno dopo nello stesso formato
    static getNextDay(day) {
        var nextDayDate = new Date(Date.parse(day) + (24 * 60 * 60 * 1000));
        var nextDay = nextDayDate.toISOString().split('T')[0];
        return nextDay;
    };

}
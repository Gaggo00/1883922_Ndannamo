import axios from "axios";

class MeteoService {
    static BASE_URL = "https://api.meteomatics.com";

    static async getMeteoInfo(latitude, longitude, date, time) {
        try {
            // Formattazione della data in formato UTC richiesto dall'API
            const formattedDateTime = `${date}T${time}:00Z`;

            // Costruzione dell'URL con i parametri richiesti
            const url = `${MeteoService.BASE_URL}/${formattedDateTime}/t_2m:C,weather_symbol_1h:idx/${latitude},${longitude}/json`;

            // Esegui richiesta GET con autenticazione di base
            const response = await axios.get(url, {
                auth: {
                    username: "doannamo_dinepi_gavriel",
                    password: "Sa0Zzx6S8Z"
                },
                headers: {
                    "Content-Type": "application/json",
                }
            });
            let temp = response.data.data[0].coordinates[0].dates[0].value;
            let index = response.data.data[1].coordinates[0].dates[0].value;

            return [temp,index];
        } catch (error) {
            console.error("Errore durante la richiesta Meteo:", error);
            throw error;
        }
    }
}

export default MeteoService;

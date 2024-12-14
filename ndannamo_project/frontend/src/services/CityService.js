import axios from "axios";

class CityService{
    static BASE_URL = "http://localhost:8080/cities"


    // Per ottenere tutte le city che iniziano con una stringa
    static async getCitiesStartingWith(start) {
        try {
            const response = await axios.get(
                `${CityService.BASE_URL}/name/${start}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }


}

export default CityService;
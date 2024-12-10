import axios from "axios";

class TripService{
    static BASE_URL = "http://localhost:8080"

    static async create(token, title, locations, startDate, endDate) {

        try {
            const response = await axios.post(
                `${TripService.BASE_URL}/trips`,
                { title, locations, startDate, endDate },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }


}

export default TripService;
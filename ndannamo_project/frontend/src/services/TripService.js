import axios from "axios";

class TripService{
    static BASE_URL = "http://localhost:8080/trips"

    static async create(token, title, locations, startDate, endDate) {

        try {
            const response = await axios.post(
                `${TripService.BASE_URL}`,
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



    static async leaveTrip(token, tripId) {

        try {
            const response = await axios.get(
                `${TripService.BASE_URL}/${tripId}/leave`,
                {
                    headers: {
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
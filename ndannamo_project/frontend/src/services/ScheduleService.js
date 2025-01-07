import axios from "axios";

class ScheduleService {
    static BASE_URL = "http://localhost:8080/trips"

    // Per ottenere la schedule
    static async getSchedule(token, tripId) {
        try {
            const response = await axios.get(
                `${ScheduleService.BASE_URL}/${tripId}/schedule`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    // TODO: funzioni per eliminare activity/travel, per creare activity/travel, 
    // per modificare campi di activity/travel/night


}

export default ScheduleService;
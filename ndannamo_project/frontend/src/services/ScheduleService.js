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


    // Per creare un'activity
    static async createActivity(token, tripId, place, date, name, startTime, endTime, address, info) {
        try {
            const response = await axios.post(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity`,
                { place, date, name, startTime, endTime, address, info },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;    // Id dell'activity creata
        } catch (error) {
            throw error;
        }
    }


    // Per eliminare un'activity
    static async deleteActivity(token, tripId, activityId) {
        try {
            const response = await axios.delete(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity/${activityId}`,
                {
                    headers: {
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



    /****************** Funzioni per modificare i vari campi degli eventi ******************/

    // Cambia info activity
    static async changeActivityInfo(token, tripId, activityId, value) {
        try{
            const response = await axios.put(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity/${activityId}/info`,
                { value },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            console.log(response);
            return response.data;
        }
        catch(err) {
            throw (err);
        }
    }
}

export default ScheduleService;
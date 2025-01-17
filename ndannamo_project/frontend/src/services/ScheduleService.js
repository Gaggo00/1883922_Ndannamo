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
                        "Authorization": `Bearer ${token}`
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
                        "Authorization": `Bearer ${token}`
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
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    // Per creare un travel
    static async createTravel(token, tripId, place, date, address, destination, arrivalDate, departureTime, arrivalTime, info) {
        try {
            const response = await axios.post(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/travel`,
                { place, date, address, destination, arrivalDate, departureTime, arrivalTime, info },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            return response.data;    // Id dell'activity creata
        } catch (error) {
            throw error;
        }
    }


    // Per eliminare un travel
    static async deleteTravel(token, tripId, travelId) {
        try {
            const response = await axios.delete(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/travel/${travelId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }




    /****************** Funzioni per modificare i vari campi degli eventi ******************/

    //***** ACTIVITY:

    // Cambia nome activity
    static async changeActivityName(token, tripId, activityId, name) {
        const value = name;
        try{
            const response = await axios.put(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity/${activityId}/name`,
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

    // Cambia indirizzo activity
    static async changeActivityAddress(token, tripId, activityId, address) {
        const value = address;
        try{
            const response = await axios.put(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity/${activityId}/address`,
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

    // Cambia time activity
    static async changeActivityTime(token, tripId, activityId, startTime, endTime) {
        const value = [startTime, endTime];
        try{
            const response = await axios.put(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/activity/${activityId}/time`,
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

    // Cambia info activity
    static async changeActivityInfo(token, tripId, activityId, info) {
        const value = info;
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


    //***** TRAVEL:

    // Cambia info travel
    static async changeTravelInfo(token, tripId, travelId, value) {
        try{
            const response = await axios.put(
                `${ScheduleService.BASE_URL}/${tripId}/schedule/travel/${travelId}/info`,
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
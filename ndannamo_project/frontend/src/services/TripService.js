import axios from "axios";

class TripService{
    static BASE_URL = "http://localhost:8080/trips"

    // Per creare nuove trips
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

    // Per ottenere tutte le tue trips
    static async getTrips(token) {
        try {
            const response = await axios.get(
                `${TripService.BASE_URL}`,
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


    // Per lasciare una trip
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

    static async deleteTrip(token, tripId) {
        try {
            const response = await axios.delete(
                `${TripService.BASE_URL}/${tripId}`,
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
    
    static async getTrip(token, tripId) {
        try {
            const response = await axios.get(
                `${TripService.BASE_URL}/${tripId}`,
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
    static async updateDates(token, tripId,startDate, endDate) {
        var value = [startDate,endDate];
        try {
            const response = await axios.put(
                `${TripService.BASE_URL}/${tripId}/dates`,
                {value},
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

    static async updateDestination(token, id, newDestination) {

    }
}

export default TripService;
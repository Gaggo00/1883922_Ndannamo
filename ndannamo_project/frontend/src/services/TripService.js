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

    static async updateDestination(token, tripId, newDestination) {
        var value = newDestination
        try {
            console.log("New locations=", value);
            const response = await axios.put(
                `${TripService.BASE_URL}/${tripId}/locations`,
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

    static async updateParticipants(token, tripId, new_participants, new_invitations, old_participants, old_invitations) {
        //console.log("new_participants:", new_participants);
        //console.log("new_invitations:", new_invitations);
        //console.log("old_participants:",old_participants);
        //console.log("old_invitations:",old_invitations);
        let participants_to_delete = old_participants.filter(element => !new_participants.includes(element));
        let invitations_to_send = new_invitations.filter(element => !old_invitations.includes(element));
        let invitations_to_revoke = old_invitations.filter(element => !new_invitations.includes(element));
        //console.log("sto provando ad invitare:",invitations_to_send);
        try {
            const requests = [];

            if (invitations_to_revoke.length > 0) {
                requests.push(
                    axios.post(
                        `${TripService.BASE_URL}/${tripId}/remove-invitations`,
                        { inviteList: invitations_to_revoke },
                        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
                    )
                );
            }

            if (participants_to_delete.length > 0) {
                requests.push(
                    axios.post(
                        `${TripService.BASE_URL}/${tripId}/remove-participants`,
                        { inviteList: participants_to_delete },
                        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
                    )
                );
            }

            if (invitations_to_send.length > 0) {
                requests.push(
                    axios.post(
                        `${TripService.BASE_URL}/${tripId}/invite`,
                        { inviteList: invitations_to_send },
                        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
                    )
                );
            }

            if (requests.length === 0) {
                return { message: "No changes to be made." };
            }

            const responses = await Promise.all(requests);

            return {
                removedInvitations: responses[0]?.data || [],
                removedParticipants: responses[1]?.data || [],
                sentInvitations: responses[2]?.data || []
            };
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }

}

export default TripService;
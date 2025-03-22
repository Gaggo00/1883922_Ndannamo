import axios from "axios";

class ChatService {

    static BASE_URL = "http://localhost:8082/api/chat";

    static async createTrip(token, tripId, listParticipants) {
        try {
            const response = await axios.post(
                `${ChatService.BASE_URL}/channels`,
                {
                    tripId: tripId,
                    listParticipants: listParticipants,
                },
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

    static async registerUser(token, nickname, email, password) {
        try {
            const response = await axios.post(
                `${ChatService.BASE_URL}/register`,
                {nickname,email, password},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            )
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    /*static async addParticipant(token, tripId) {
        try {
            const response = await axios.pull(
                `${ChatService.BASE_URL}/channels`,
                {
                    tripId: tripId,
                    listParticipants: listParticipants,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                } 
            )
        } catch (error) {
            throw error;
        }
    }*/


    static async getMessages(token, tripId) {
        try {
            const response = await axios.get(
                `${ChatService.BASE_URL}/${tripId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            )
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }

    static async getOnlineUsers(token, tripId) {
        try {
            const response = await axios.get(
                `${ChatService.BASE_URL}/${tripId}/presence`,
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
}

export default ChatService;

import axios from "axios";

export default class UserService {
    static BASE_URL = "http://localhost:8080/profile"


    static async getProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    
    static async acceptInvitation(token, tripId, value) {

        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/invitations/${tripId}`,
                { value },
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

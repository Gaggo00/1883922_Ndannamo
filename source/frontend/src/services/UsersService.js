import axios from "axios";

export default class UsersService {
    static BASE_URL = "http://localhost:8080/users"


    static async getAllUsers(token) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async userExists(token, email) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/${email}/exists`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"}
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

}

import axios from "axios";

export default class UserService {
    static BASE_URL = "http://localhost:8080/users"


    static async getAllUsers(token) {
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

}

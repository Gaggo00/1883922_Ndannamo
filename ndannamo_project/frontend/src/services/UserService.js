import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8080"

    static async login(email, password) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/api/auth/login`,
                {email, password},
                {
                    headers: {
                        "Content-Type": "application/json"

                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }

    static async register(email, password) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/api/auth/register`,
                {email, password},
                {
                    headers: {
                        "Content-Type": "application/json"

                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }


    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }


    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/api/auth/getMyProfile`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            console.log(response.data)
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}


export default UserService;
import axios from "axios";

class AuthService {
    static BASE_URL = "http://localhost:8080/api/auth"

    static async login(email, password) {
        try {
            const response = await axios.post(
                `${AuthService.BASE_URL}/login`,
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

    static async register(nickname, email, password) {
        try {
            const response = await axios.post(
                `${AuthService.BASE_URL}/register`,
                {nickname,email, password},
                {
                    headers: {
                        "Content-Type": "application/json"

                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
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


}


export default AuthService;
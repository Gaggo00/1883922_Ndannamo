import axios from "axios";

class AuthService {
    static BASE_URL = "http://localhost:8080"

    static async login(email, password) {
        try {
            const response = await axios.post(
                `${AuthService.BASE_URL}/api/auth/login`,
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

    static async register(email, nickname, password) {
        try {
            const response = await axios.post(
                `${AuthService.BASE_URL}/api/auth/register`,
                {email, nickname, password},
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


    static async changePassword(token,currentPassword,newPassword) {
        try{
            const response = await axios.post(
                `${AuthService.BASE_URL}/api/auth/change-password`,
                {currentPassword, newPassword},
                {
                    headers: {Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"}
                });
            console.log(response);
            return response.data;
        }
        catch(err) {
            throw (err);
        }
    }

}


export default AuthService;
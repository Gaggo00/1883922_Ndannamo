import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:8080"

    static async login(email, password) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/api/auth/login`,
                { email, password },
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

    static async register(userData, token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

}

export default UserService;
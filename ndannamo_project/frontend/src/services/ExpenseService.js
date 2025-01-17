import axios from "axios";

class ExpenseService {

    static BASE_URL = "http://localhost:8080/trips"


    // Per ottenere tutte le spese della trip
    static async getExpenses(token, tripId) {
        try {
            const response = await axios.get(
                `${ExpenseService.BASE_URL}/${tripId}/expenses`,
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

    
    // Per creare nuove trips
    static async create(token, title, paidBy, date, amount, splitEven, amountPerUser) {
        try {
            const response = await axios.post(
                `${ExpenseService.BASE_URL}`,
                { title, title, paidBy, date, amount, splitEven, amountPerUser },
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
    
}

export default ExpenseService;
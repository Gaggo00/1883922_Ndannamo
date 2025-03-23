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
    static async create(token, tripId, title, paidByNickname, paidById, date, amount, splitEven, amountPerUser, refund) {
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Aggiungi lo zero davanti al mese se è inferiore a 10
        let day = ("0" + date.getDate()).slice(-2);
        let formattedDate = `${year}-${month}-${day}`;
        try {
            const response = await axios.post(
                `${ExpenseService.BASE_URL}/${tripId}/expenses`,
                {
                    title: title,
                    paidByNickname: paidByNickname,
                    paidById: paidById,
                    date: formattedDate,
                    amount: amount,
                    splitEven: splitEven,
                    amountPerUser: amountPerUser,
                    refund: refund,
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
            throw error; // L'errore sarà gestito all'esterno
        }
    }

    static async delete(token, tripId, expenseId) {
        try {
            const response = await axios.delete(
                `${ExpenseService.BASE_URL}/${tripId}/expenses/${expenseId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async update(token, tripId, expenseId, updatedExpense) {
        const {title, paidByNickname, paidBy, date, amount, splitEven, amountPerUser, refund} = updatedExpense;

        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Aggiungi lo zero davanti al mese se è inferiore a 10
        let day = ("0" + date.getDate()).slice(-2);
        let formattedDate = `${year}-${month}-${day}`;
        try {
            const response = await axios.put(
                `${ExpenseService.BASE_URL}/${tripId}/expenses/${expenseId}`,
                {
                    title: title,
                    paidByNickname: paidByNickname,
                    paidById: paidBy,
                    date: formattedDate,
                    amount: amount,
                    splitEven: splitEven,
                    amountPerUser: amountPerUser,
                    refund: refund,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                }
            );
            return response;  // La risposta del server
        } catch (error) {
            throw error;
        }
    }
}

export default ExpenseService;
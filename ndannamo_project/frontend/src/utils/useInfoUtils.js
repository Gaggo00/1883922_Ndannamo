import TripService from "../services/TripService";
import UserService from "../services/UserService";

export const fetchUserData = async (tripInfo, profileInfo,id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { tripInfo: null, profileInfo: null };
        }

        const newTripInfo = tripInfo || await TripService.getTrip(token,id);
        const newProfileInfo = profileInfo || await UserService.getProfile(token);

        return { tripInfo: newTripInfo, profileInfo: newProfileInfo };
    } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        throw error;
    }
};

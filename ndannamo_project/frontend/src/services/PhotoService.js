import axios from 'axios';

class PhotoService {

    static BASE_URL = "http://localhost:8080/trips"


    // Per ottenere la lista di id delle foto
    static async getPhotoIds(token, tripId) {
        try {
            const response = await axios.get(`${PhotoService.BASE_URL}/${tripId}/photos`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    // Per caricare una sola foto (per piu' foto insieme bisogna ancora farlo lato backend)
    static async uploadPhoto(token, tripId, file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`${PhotoService.BASE_URL}/${tripId}/photos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    // Per ottenere una foto
    static async getPhoto(token, tripId, photoId) {
        try {
            const response = await axios.get(`${PhotoService.BASE_URL}/${tripId}/photos/${photoId}`, {
                headers: {
                    'Content-Type': 'image/png',
                    "Authorization": `Bearer ${token}`
                },
                responseType: "blob"
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Per ottenere info foto
    static async getPhotoInfo(token, tripId, photoId) {
        try {
            const response = await axios.get(`${PhotoService.BASE_URL}/${tripId}/photos/${photoId}/info`, {
                headers: {
                    'Content-Type': "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Per eliminare una foto
    static async deletePhoto(token, tripId, photoId) {
        try {
            const response = await axios.delete(`${PhotoService.BASE_URL}/${tripId}/photos/${photoId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /*
    axios.get(endpoint, {
        headers: { Authorization: 'xxxxxxxxxxxx' },
        responseType: "arraybuffer",
    })
    .then((response: any) => {
        let data = `data:${
        response.headers["content-type"]
        };base64,${new Buffer(response.data, "binary").toString("base64")}`;
    */


    /*
    static async uploadPhoto(token, tripId, files) {
        const formData = new FormData();
        files.forEach(file => formData.append("image", file));

        try {
            const response = await axios.post(`${PhotoService.BASE_URL}/${tripId}/photos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading files:", error);
            throw error;
        }
    }
    */
}

export default PhotoService;
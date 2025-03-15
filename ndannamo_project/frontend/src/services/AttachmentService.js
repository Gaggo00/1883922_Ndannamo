import axios from 'axios';



class AttachmentService {
    static BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    static FRONT_END_URL = process.env.REACT_APP_FRONT_END_URL || 'http://localhost:3000';

    static async uploadFiles(token, files, tripId) {
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            const response = await axios.post(`${AttachmentService.BASE_URL}/trips/${tripId}/attachments`, formData, {
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

    static async linkAttachmentsToAttachable(token, attachableId, attachmentIds) {
        try {
            const response = await axios.post(`${AttachmentService.BASE_URL}/attachable/${attachableId}/attachments`, attachmentIds, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization" : `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error linking attachments:", error);
            throw error;
        }
    }

    static async getAttachments(token, attachableId) {
        try {
            const response = await axios.get(
                `${AttachmentService.BASE_URL}/attachable/${attachableId}/attachments`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            var attachments = Array.isArray(response.data) ? response.data : [];

            return attachments.map(attachment => {
                const url = `${AttachmentService.BASE_URL}/attachments/${attachment.id}`;
                return {
                    id: attachment.id,
                    name: attachment.fileName,
                    url: url
                };
            })
        } catch (error) {
            console.error("Error fetching attachments:", error);
            throw error;
        }
    }

    static async getAttachmentData(token, url) {
        try {
            const response = await axios.get(
                url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching attachments:", error);
            throw error;
        }
    }

    static async getPhoto(token, tripId, photoId) {
        try {
            const response = await axios.get(`${AttachmentService.BASE_URL}/attachments/${photoId}`, {
                headers: {
                    'Content-Type': 'image/png',
                    "Authorization": `Bearer ${token}`
                },
                responseType: "blob"
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading files:", error);
            throw error;
        }
    }

    static async unlinkAttachment(token, attachableId, attachmentId) {
        try {
            const response = await axios.delete(
                `${AttachmentService.BASE_URL}/attachable/${attachableId}/attachments/${attachmentId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error unlinking attachment:", error);
            throw error;
        }
    }

    static async deleteAttachment(token, attachmentId) {
        try {
            const response = await axios.delete(
                `${AttachmentService.BASE_URL}/attachments/${attachmentId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting attachment:", error);
            throw error;
        }
    }

// Per caricare una sola foto (per piu' foto insieme bisogna ancora farlo lato backend)
    static async uploadPhoto(token, tripId, file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`${AttachmentService.BASE_URL}/trips/${tripId}/photos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading files:", error);
            throw error;
        }
    }

}

export default AttachmentService;
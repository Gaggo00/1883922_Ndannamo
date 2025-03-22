import axios from "axios";

import CityService from "./CityService";

class MapService {
    
    /*
        API per geocoding:
        https://docs.locationiq.com/docs/quickstart-convert-coordinates-to-addresses

    */

    static GEOCODING_URL = "https://us1.locationiq.com/v1/search";
    static ACCESS_TOKEN = "pk.3c67ac14f239c15cd8764ce1b94853fb";

    // Per ottenere le coordinate di un indirizzo preciso dall'API
    static async getCoordinates(address, cityLat, cityLon) {

        const maxLat = +(cityLat) + 0.1;
        const maxLon = +(cityLon) + 0.1;

        const minLat = +(cityLat) - 0.1;
        const minLon = +(cityLon) - 0.1;

        try {
            
            const response = await axios.get(
                `${MapService.GEOCODING_URL}`,
                {
                    params: {
                        "key":`${MapService.ACCESS_TOKEN}`,
                        "q":`${address}`,
                        "format":"json",
                        "limit":"1",
                        "viewbox":`${maxLon},${maxLat},${minLon},${minLat}`,
                        "bounded":"1"
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            return [response.data[0].lat, response.data[0].lon];
        } catch (error) {
            throw error;
        }
    }


    // Per ottenere le coordinate di una citta' dal nostro backend
    static async getCityCoordinates(name, country) {
        try {
            return await CityService.getCityCoordinates(name, country);
        } catch (error) {
            throw error;
        }
    }
}

export default MapService;
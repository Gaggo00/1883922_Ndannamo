export default class DataManipulationsUtils {


    static convertBase64ToBitArray(data) {
        const byteCharacters = atob(data); // Decodifica Base64
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
    }

}
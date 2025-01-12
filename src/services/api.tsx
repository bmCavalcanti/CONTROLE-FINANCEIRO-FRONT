import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3100", // Substitua pela URL do seu backend
    headers: {
        token: "TOKENTESTE"
    }
});

export default api;

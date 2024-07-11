import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7173"
});

export default api;
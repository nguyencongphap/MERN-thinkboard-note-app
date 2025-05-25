import axios from "axios";

// axios instance
const api = axios.create({ baseURL: "http://localhost:5001/api/" });

export default api;

import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: false,
});

api.interceptors.request.use(
    async (config) => {
        console.log("Entering Interceptor configuration")
        const token = await localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("returning interceptor configuration");
        return config;
    },
    (error) => {
        console.error("Error in interceptor configuration");
        Promise.reject(error);
    }
)

export default api;
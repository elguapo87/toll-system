import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const isLoginRequest = url.includes("/adminLogin") || url.includes("/login");

        if (status === 401 && !isLoginRequest) {
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;
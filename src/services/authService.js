import api from "./api";

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en el registro');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return { token, user };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en el inicio de sesión');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};
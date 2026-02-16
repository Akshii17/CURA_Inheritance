import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true  //this means that we are allwoing cookies
})
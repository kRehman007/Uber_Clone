import axios from "axios";

export function getToken() {
  return localStorage.getItem("token") ?? "";
}
const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

export default AxiosInstance;

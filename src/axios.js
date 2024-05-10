import axios from "axios";
const REACT_APP_API_URL = process.env.NEXT_PUBLIC_API_URL;;

const axiosInstance = axios.create({ baseURL: REACT_APP_API_URL });
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

export default axiosInstance;

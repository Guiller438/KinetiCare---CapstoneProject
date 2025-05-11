import axios from "axios";

const api = axios.create({
  baseURL: "http://10.10.60.13:7000", // ⚠️ URL del API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

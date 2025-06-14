import axios from "axios";
import { getEnvVar } from "./env";

const API = axios.create({
  baseURL: getEnvVar("VITE_API_BASE_URL"),
});

export default API;

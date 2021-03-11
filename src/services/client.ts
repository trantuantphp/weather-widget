import axios from "axios";
import { REQUEST_TIMEOUT, API_URL } from "shared/constants";

const client = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: API_URL,
});

client.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default client;
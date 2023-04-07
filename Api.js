import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://teus.online/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (params) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      params.headers.token = token;
    }
    return params;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const token = await AsyncStorage.getItem("token");
    if (token && error.response.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("account");
    }
    return Promise.reject(error);
  }
);

class Api {
  static url = API_URL;

  static login(email, password) {
    //return api.post('/users/login', { email, password });
    return { data: { token: "123456", user: { name: "James" } } };
  }
}

export default Api;

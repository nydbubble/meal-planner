import axios from "axios";

const API_URL = "/api/";

const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "auth", {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const register = async (name, email, password) => {
  try {
    const response = await axios.post(API_URL + "users", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  getCurrentUser,
};

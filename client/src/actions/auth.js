import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import setAuthHeader from "../utils/auth-header";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthHeader(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register = (newUser) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify(newUser);

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.error(errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

      dispatch({
        type: AUTH_ERROR,
      });
    }
  }
};

export const login = (user) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify(user);

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

      dispatch({
        type: AUTH_ERROR,
      });
    }
  }
};

export const logout = () => ({ type: LOGOUT });

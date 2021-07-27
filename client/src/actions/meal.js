import { GET_MEALS, MEALS_ERROR } from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import dayjs from "dayjs";

export const getMeals = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/meals");
    res.data = res.data.map((item) => ({ ...item, date: dayjs(item.date) }));

    dispatch({
      type: GET_MEALS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEALS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addMeal = (meal) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify(meal);
  try {
    const res = await axios.post(`/api/meals/`, body, config);
    dispatch(getMeals());
    dispatch(setAlert("Meal added successfully.", "success"));
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const editMeal = (meal) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify(meal);
  console.log(body);
  try {
    const res = await axios.put(`/api/meals/${meal._id}`, body, config);
    dispatch(getMeals());
    dispatch(setAlert("Meal editted successfully.", "success"));
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteMeal = (meal_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/meals/${meal_id}`);
    dispatch(getMeals());
    dispatch(setAlert("Meal deleted successfully.", "danger"));
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

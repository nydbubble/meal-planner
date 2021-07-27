import { GET_RECIPES, RECIPE_ERROR } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const getRecipes = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/recipes");

    dispatch({
      type: GET_RECIPES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RECIPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteRecipe = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/recipes/${id}`);

    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));
  }
};

export const editRecipe = (id, recipe) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify(recipe);
  try {
    const res = await axios.put(`/api/recipes/${id}`, body, config);
    dispatch(setAlert("Recipe editted successfully.", "success"));
  } catch (err) {
    console.error(err);
  }
};

export const addRecipe = (recipe) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify(recipe);

  try {
    const res = await axios.post("/api/recipes", body, config);

    dispatch(setAlert("Recipe added successfully", "success"));
  } catch (err) {
    console.error(err);

    dispatch(setAlert(err.response.statusText, "danger"));
  }
};

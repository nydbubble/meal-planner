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
    dispatch({
      type: GET_RECIPES,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response.statusText, "danger"));
  }
};

export const editRecipe = (id, recipe) => async (dispatch) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  const body = new FormData();
  for (let key in recipe) {
    if (key === "image" && typeof recipe.image !== "string") {
      body.append(key, recipe[key]);
    } else body.append(key, JSON.stringify(recipe[key]));
  }

  try {
    const res = await axios.put(`/api/recipes/${id}`, body, config);
    dispatch(setAlert("Recipe editted successfully.", "success"));
    dispatch(getRecipes());
  } catch (err) {
    console.error(err);
    dispatch(setAlert(err.response.statusText, "danger"));
  }
};

export const addRecipe = (recipe) => async (dispatch) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  const body = new FormData();
  for (let key in recipe) {
    if (key === "image" && typeof recipe.image !== "string") {
      body.append(key, recipe[key]);
    } else body.append(key, JSON.stringify(recipe[key]));
  }

  try {
    const res = await axios.post("/api/recipes", body, config);

    dispatch(setAlert("Recipe added successfully", "success"));
    dispatch(getRecipes());
  } catch (err) {
    console.error(err);

    dispatch(setAlert(err.response.statusText, "danger"));
  }
};

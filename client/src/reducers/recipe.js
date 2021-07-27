import { GET_RECIPES, RECIPE_ERROR } from "../actions/types";

const initialState = {
  recipes: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_RECIPES:
      return {
        ...state,
        recipes: payload,
        loading: false,
      };
    case RECIPE_ERROR:
      return {
        ...state,
        recipes: [],
        loading: false,
      };
    default:
      return state;
  }
}

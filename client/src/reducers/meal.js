import { GET_MEALS, MEALS_ERROR, LOGOUT } from "../actions/types";

const initialState = {
  meals: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEALS:
      return {
        ...state,
        loading: false,
        meals: payload,
      };
    case MEALS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        meals: [],
        loading: false,
        error: {},
      };
    default:
      return state;
  }
}

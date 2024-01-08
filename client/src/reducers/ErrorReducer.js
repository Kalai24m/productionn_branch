// errorReducer.js
import { GET_ERRORS } from "actions/types";

const initialState = {};

// Give your function a name (e.g., errorReducer)
export function errorReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return { ...action.payload };
    default:
      return state;
  }
}

export default errorReducer;

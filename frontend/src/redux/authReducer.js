// mapReducer.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, CHECK_AUTH,LOGOUT } from "../actions/types";

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case CHECK_AUTH:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
      case LOGOUT:
        return initialState;
    default:
      return state;
  }
}

export default authReducer;

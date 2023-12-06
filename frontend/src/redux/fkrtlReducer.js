// mapReducer.js
import { FETCH_MARKER_FKRTL } from "../actions/types";

const initialState = {
  loading: true,
  markerlist: [],
  markerobj: {},
  errmessage: "",
};

function fkrtlReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_MARKER_FKRTL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        markerlist: payload,
        markerobj: {},
      };

    default:
      return state;
  }
}

export default fkrtlReducer;

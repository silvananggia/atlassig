// mapReducer.js
import { FETCH_MARKER_FKRTL, FETCH_FKRTL_CABANG } from "../actions/types";

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
      case FETCH_FKRTL_CABANG:
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

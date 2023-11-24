// mapReducer.js
import { FETCH_MARKER_FKTP } from "../actions/types";

const initialState = {
  loading: true,
  markerlist: [],
  markerobj: {},
  errmessage: "",
};

function mapReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_MARKER_FKTP:
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

export default mapReducer;

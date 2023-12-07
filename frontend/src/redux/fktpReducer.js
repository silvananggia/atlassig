// mapReducer.js
import { FETCH_MARKER_FKTP, FETCH_FKTP_CABANG,FETCH_FKTP_LIST } from "../actions/types";

const initialState = {
  loading: true,
  markerlist: [],
  markerobj: {},
  errmessage: "",
};

function fktpReducer(state = initialState, action) {
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
    case FETCH_FKTP_CABANG:
      return {
        ...state,
        loading: false,
        errmessage: "",
        markerlist: payload,
        markerobj: {},
      };
    case FETCH_FKTP_LIST:
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

export default fktpReducer;

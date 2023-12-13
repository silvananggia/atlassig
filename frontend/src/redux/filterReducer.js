// mapReducer.js
import { FETCH_CENTER_CABANG, FETCH_BBOX_CABANG } from "../actions/types";

const initialState = {
  loading: true,
  datalist: [],
  dataobj: {},
  errmessage: "",
  coordinate: "",
  bbox: "",
};

function fktpReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CENTER_CABANG:
      return {
        ...state,
        loading: false,
        errmessage: "",
        coordinate: payload,
      };

    case FETCH_BBOX_CABANG:
      return {
        ...state,
        loading: false,
        errmessage: "",
        dataobj: payload,
      };

    default:
      return state;
  }
}

export default fktpReducer;

// mapReducer.js
import { FETCH_MARKER_FKRTL, FETCH_FKRTL_CABANG } from "../actions/types";

const initialState = {
  loading: true,
  fkrtllist: [],
  fkrtlobj: {},
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
        fkrtllist: payload,
        fkrtlobj: {},
      };
      case FETCH_FKRTL_CABANG:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtllist: payload,
        fkrtlobj: {},
      };

    default:
      return state;
  }
}

export default fkrtlReducer;

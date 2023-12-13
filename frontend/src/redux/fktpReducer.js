// mapReducer.js
import {
  FETCH_MARKER_FKTP,
  FETCH_FKTP_CABANG,
  FETCH_FKTP_KEDEPUTIAN,
  FETCH_FKTP_LIST,
  FETCH_FKTP_DETAIL,
} from "../actions/types";

const initialState = {
  loading: true,
  fktplist: [],
  fktpobj: {},
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
        fktplist: payload,
        fktpobj: {},
      };
    case FETCH_FKTP_CABANG:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktplist: action.payload,
        fktpobj: {},
      };
      case FETCH_FKTP_KEDEPUTIAN:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktplist: action.payload,
        fktpobj: {},
      };
    case FETCH_FKTP_LIST:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktplist: action.payload,
        fktpobj: {},
      };
    case FETCH_FKTP_DETAIL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktpobj: action.payload,
      };

    default:
      return state;
  }
}

export default fktpReducer;

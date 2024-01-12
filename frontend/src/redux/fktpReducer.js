// mapReducer.js
import {
  FETCH_MARKER_FKTP,
  FETCH_FKTP_CABANG,
  FETCH_FKTP_KEDEPUTIAN,
  FETCH_FKTP_DETAIL,
  FETCH_FILTER_FKTP_LIST,
  FETCH_FILTER_FKTP,
  FETCH_COUNT_FKTP,
  FETCH_COUNT_JENIS_FKTP,
  FETCH_FILTER_FKTP_PUBLIK,
  FETCH_FILTER_FKTP_LIST_PUBLIK,
  FETCH_FKTP_REQUEST,
  CLEAR_DATA_FKTP,
} from "../actions/types";

const initialState = {
  loading: true,
  fktplist: [],
  fktpdatalist: [],
  datalistfktp: [],
  totalfktp: [],
  fktpobj: {},
  metadata:{},
  errmessage: "",
  page: 1,
};

function fktpReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FKTP_REQUEST:
      return {
        ...state,
        loading: true,
        errmessage: "",
      };
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
    case FETCH_COUNT_JENIS_FKTP:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfktp: payload,
      };
    case FETCH_COUNT_FKTP:
      return {
        ...state,
        loading: false,
        errmessage: "",
        totalfktp: payload,
      };
    case FETCH_FILTER_FKTP:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktplist: payload,
      };
    case FETCH_FKTP_DETAIL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktpobj: action.payload,
      };
    case FETCH_FILTER_FKTP_LIST:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktpdatalist: [...state.fktpdatalist, ...payload.data],
        page: state.page + 1,
        metadata: payload.metadata,
      };
    case FETCH_FILTER_FKTP_PUBLIK:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktplist: payload,
      };
    case FETCH_FILTER_FKTP_LIST_PUBLIK:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fktpdatalist: payload,
      };
    case CLEAR_DATA_FKTP:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export default fktpReducer;

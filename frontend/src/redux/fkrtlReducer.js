// mapReducer.js
import {
  FETCH_MARKER_FKRTL,
  FETCH_FKRTL_CABANG,
  FETCH_FKRTL_KEDEPUTIAN,
  FETCH_FILTER_FKRTL_LIST,
  FETCH_COUNT_FKRTL,
  FETCH_COUNT_JENIS_FKRTL,
  FETCH_FILTER_FKRTL,
  FETCH_FILTER_FKRTL_PUBLIK,
  FETCH_FILTER_FKRTL_LIST_PUBLIK,
  FETCH_FKTP_REQUEST,
  CLEAR_DATA_FKRTL,
} from "../actions/types";

const initialState = {
  loading: true,
  fkrtllist: [],
  fkrtldatalist: [],
  datalistfkrtl: [],
  totalfkrtl:{},
  fkrtlobj: {},
  metadata:{},
  errmessage: "",
  page: 1,
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
    case FETCH_FKRTL_KEDEPUTIAN:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtllist: payload,
        fkrtlobj: {},
      };
    case FETCH_COUNT_JENIS_FKRTL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfkrtl: payload,
      };
      case FETCH_COUNT_FKRTL:
        return {
          ...state,
          loading: false,
          errmessage: "",
          totalfkrtl: payload,
        };
    case FETCH_FILTER_FKRTL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtllist: payload,
      };
    case FETCH_FILTER_FKRTL_LIST:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtldatalist: [...state.fkrtldatalist, ...payload.data],
        page: state.page + 1,
        metadata: payload.metadata,
      };
    case FETCH_FILTER_FKRTL_PUBLIK:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtllist: payload,
      };
    case FETCH_FILTER_FKRTL_LIST_PUBLIK:
      return {
        ...state,
        loading: false,
        errmessage: "",
        fkrtldatalist: payload,
      };
      case CLEAR_DATA_FKRTL:
        return {
          ...initialState,
        };
    default:
      return state;
  }
}

export default fkrtlReducer;

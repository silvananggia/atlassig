// mapReducer.js
import {
  FETCH_CENTER_CABANG,
  FETCH_BBOX_CABANG,
  FETCH_CENTER_KEDEPUTIAN,
  FETCH_BBOX_KEDEPUTIAN,
  FETCH_AUTO_WILAYAH,
  FETCH_JENIS_FKRTL,
  FETCH_JENIS_FKTP,
  FETCH_FILTER_FKTP_LIST,
  FETCH_FILTER_FKRTL_LIST,
  FETCH_COUNT_FKRTL,
  FETCH_COUNT_FKTP,
} from "../actions/types";

const initialState = {
  loading: true,
  datalist: [],
  jenisfktp: [],
  jenisfkrtl: [],
  datalistfktp: [],
  datalistfkrtl: [],
  dataobj: {},
  errmessage: "",
  coordinate: "",
  bbox: "",
  wilayahlist: [],
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

    case FETCH_CENTER_KEDEPUTIAN:
      return {
        ...state,
        loading: false,
        errmessage: "",
        coordinate: payload,
      };

    case FETCH_BBOX_KEDEPUTIAN:
      return {
        ...state,
        loading: false,
        errmessage: "",
        dataobj: payload,
      };
    case FETCH_AUTO_WILAYAH:
      return {
        ...state,
        loading: false,
        errmessage: "",
        wilayahlist: payload,
      };
    case FETCH_JENIS_FKRTL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        jenisfkrtl: payload,
      };
    case FETCH_JENIS_FKTP:
      return {
        ...state,
        loading: false,
        errmessage: "",
        jenisfktp: payload,
      };
      case FETCH_FILTER_FKTP_LIST:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfktp: payload,
      };
      case FETCH_FILTER_FKRTL_LIST:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfkrtl: payload,
      };
      case FETCH_COUNT_FKTP:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfktp: payload,
      };
      case FETCH_COUNT_FKRTL:
      return {
        ...state,
        loading: false,
        errmessage: "",
        datalistfkrtl: payload,
      };
    default:
      return state;
  }
}

export default fktpReducer;

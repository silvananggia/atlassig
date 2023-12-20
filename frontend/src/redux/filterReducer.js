// mapReducer.js
import {
  FETCH_CENTER_CABANG,
  FETCH_BBOX_CABANG,
  FETCH_CENTER_KEDEPUTIAN,
  FETCH_BBOX_KEDEPUTIAN,
  FETCH_AUTO_WILAYAH,
  FETCH_JENIS_FKRTL,
  FETCH_JENIS_FKTP,
  FETCH_CABANG,
  FETCH_WILAYAH_DEPUTI,
  FETCH_WILAYAH_CABANG,
  FETCH_KODE_DEPUTI,
  FETCH_CABANG_DEPUTI,

  
} from "../actions/types";

const initialState = {
  loading: true,
  datalist: [],
  jenisfktp: [],
  jenisfkrtl: [],
  
  datalistfkrtl: [],
  datalistfilter: [],
  cabanglist: [],
  dataobj: {},
  errmessage: "",
  coordinate: "",
  bbox: "",
  kodedep: "",
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
      case FETCH_CABANG:
        return {
          ...state,
          loading: false,
          errmessage: "",
          cabanglist: payload,
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
      
      case FETCH_WILAYAH_DEPUTI:
      return {
        ...state,
        loading: false,
        errmessage: "",
        wilayahlist: payload,
      };

      case FETCH_WILAYAH_CABANG:
        return {
          ...state,
          loading: false,
          errmessage: "",
          wilayahlist: payload,
        };

        case FETCH_KODE_DEPUTI:
        return {
          ...state,
          loading: false,
          errmessage: "",
          kodedep: payload,
        };
        case FETCH_CABANG_DEPUTI:
        return {
          ...state,
          loading: false,
          errmessage: "",
          cabanglist: payload,
        };
      
    default:
      return state;
  }
}

export default fktpReducer;

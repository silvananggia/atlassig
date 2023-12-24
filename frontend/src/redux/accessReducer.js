// mapReducer.js
import { FETCH_AUTH_EMBED, FETCH_EMBED_FASKES} from "../actions/types";

const initialState = {
  loading: true,
  isAuthenticated: false,
  datalist: [],
  dataobj: {},
  errmessage: "",
};

function accessReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_AUTH_EMBED:
      return {
        ...state,
        loading: false,
        errmessage: "",
        user: payload,
        isAuthenticated: true,
      };
    

    case FETCH_EMBED_FASKES:
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

export default accessReducer;

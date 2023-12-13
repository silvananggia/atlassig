// mapReducer.js
import { FETCH_EMBED_FASKES} from "../actions/types";

const initialState = {
  loading: true,
  datalist: [],
  dataobj: {},
  errmessage: "",
};

function accessReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
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

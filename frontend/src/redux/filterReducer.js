// mapReducer.js
import { FETCH_CENTER_CABANG } from "../actions/types";

const initialState = {
  loading: true,
  markerlist: [],
  markerobj: {},
  errmessage: "",
  coordinate: "",
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

    default:
      return state;
  }
}

export default fktpReducer;

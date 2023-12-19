
import {
    SHOW_LOADING
    } from "../actions/types";

const initialState = {
    isLoading: true,
  };
  
  const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default loadingReducer;
  
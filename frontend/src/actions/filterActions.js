// mapActions.js
import { FETCH_CENTER_CABANG,FETCH_BBOX_CABANG } from "./types";

import FilterService from "../services/filterService";

export const fetchCenterCabang = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getCenterCabang(id);
    
    dispatch({
      type: FETCH_CENTER_CABANG,
      payload: res.data.data.features[0].geometry.coordinates,
    });
    
  } catch (err) {
    console.error(err);
  }
};

export const fetchBBOXCabang = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getBBOXCabang(id);
   
    dispatch({
      type: FETCH_BBOX_CABANG,
      payload: res.data.data,
    });
    
  } catch (err) {
    console.error(err);
  }
};

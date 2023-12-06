import { FETCH_MARKER_FKRTL } from "./types";

import FKRTLService from "../services/fkrtlService";


export const fetchMarkersFKRTL = (lat, lon) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFKRTL(lat, lon);
    dispatch({
      type: FETCH_MARKER_FKRTL,
      payload: res.data.data,
    });
    
  } catch (err) {
    console.error(err);
  }
};

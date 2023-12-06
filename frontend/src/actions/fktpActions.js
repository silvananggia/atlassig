// mapActions.js
import { FETCH_MARKER_FKTP } from "./types";

import FKTPService from "../services/fktpService";

export const fetchMarkersFKTP = (lat, lon) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTP(lat, lon);
    dispatch({
      type: FETCH_MARKER_FKTP,
      payload: res.data.data,
    });
    
  } catch (err) {
    console.error(err);
  }
};

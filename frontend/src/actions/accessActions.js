// mapActions.js
import { FETCH_EMBED_FASKES } from "./types";

import accessService from "../services/accessService";

export const fetchEmbedFaskes = (id) => async (dispatch) => {
  try {
    const res = await accessService.getLocationEmbed(id);
  //  console.log(res);
    dispatch({
      type: FETCH_EMBED_FASKES,
      payload: res.data,
    });
    
  } catch (err) {
    console.error(err);
  }
};

import { FETCH_AUTH_EMBED,FETCH_EMBED_FASKES, } from "./types";

import accessService from "../services/accessService";

export const checkAuthEmbed = () => async (dispatch) => {
  try {
    const res = await accessService.checkAuthEmbed();
  //  console.log(res);
    dispatch({
      type: FETCH_AUTH_EMBED,
      payload: res.data,
    });
    
  } catch (err) {
    console.error(err);
  }
};


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

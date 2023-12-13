// mapActions.js
import {
  FETCH_MARKER_FKTP,
  FETCH_FKTP_CABANG,
  FETCH_FKTP_KEDEPUTIAN,
  FETCH_FKTP_LIST,
  FETCH_FKTP_DETAIL,
} from "./types";

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

export const fetchFKTPCabang = (id) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTPCabang(id);
    dispatch({
      type: FETCH_FKTP_CABANG,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchFKTPKedeputian = (id) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTPKedeputian(id);
    dispatch({
      type: FETCH_FKTP_KEDEPUTIAN,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFKTPList = (page, limit) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTPList(page, limit);
    dispatch({
      type: FETCH_FKTP_LIST,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFKTPDetail = (id) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTPDetail(id);
    dispatch({
      type: FETCH_FKTP_DETAIL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

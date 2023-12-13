// mapActions.js
import {
  FETCH_CENTER_CABANG,
  FETCH_BBOX_CABANG,
  FETCH_BBOX_KEDEPUTIAN,
  FETCH_CENTER_KEDEPUTIAN,
} from "./types";

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

export const fetchCenterKedeputian = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getCenterKedeputian(id);

    dispatch({
      type: FETCH_CENTER_KEDEPUTIAN,
      payload: res.data.data.features[0].geometry.coordinates[0],
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchBBOXKedeputian = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getBBOXKedeputian(id);

    dispatch({
      type: FETCH_BBOX_KEDEPUTIAN,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

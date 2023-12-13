import {
  FETCH_MARKER_FKRTL,
  FETCH_FKRTL_CABANG,
  FETCH_FKRTL_KEDEPUTIAN,
  FETCH_FKRTL_LIST,
  FETCH_FKRTL_DETAIL,
} from "./types";

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

export const fetchFKRTLCabang = (id) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFKRTLCabang(id);
    dispatch({
      type: FETCH_FKRTL_CABANG,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFKRTLKedeputian = (id) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFKRTLKedeputian(id);
    dispatch({
      type: FETCH_FKRTL_KEDEPUTIAN,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFKRTLList = (page, limit) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFKRTLList(page, limit);
    dispatch({
      type: FETCH_FKRTL_LIST,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFKRTLDetail = (id) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFKRTLDetail(id);
    dispatch({
      type: FETCH_FKRTL_DETAIL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};
import {
  FETCH_MARKER_FKRTL,
  FETCH_FKRTL_CABANG,
  FETCH_FKRTL_KEDEPUTIAN,
  FETCH_FKRTL_LIST,
  FETCH_FKRTL_DETAIL,
  FETCH_FILTER_FKRTL_LIST,
  FETCH_COUNT_FKRTL,
  FETCH_COUNT_JENIS_FKRTL,
  FETCH_FILTER_FKRTL,
  FETCH_FILTER_FKRTL_PUBLIK,
  FETCH_FILTER_FKRTL_LIST_PUBLIK,
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



export const fetchFilterFKRTL= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFilterFKRTL(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKRTL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchFilterFKRTLList= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFilterFKRTLlist(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKRTL_LIST,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchFilterFKRTLPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFilterFKRTLPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKRTL_PUBLIK,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchFilterFKRTLListPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    const res = await FKRTLService.getFilterFKRTLlistPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKRTL_LIST_PUBLIK,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchCountJenisFKRTL=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    const res = await FKRTLService.countJenisFKRTL(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_JENIS_FKRTL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchCountFKRTL=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    const res = await FKRTLService.countFKRTL(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_FKRTL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};
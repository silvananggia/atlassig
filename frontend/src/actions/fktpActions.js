// mapActions.js
import {
  FETCH_MARKER_FKTP,
  FETCH_FKTP_CABANG,
  FETCH_FKTP_KEDEPUTIAN,
  FETCH_FKTP_LIST,
  FETCH_FKTP_DETAIL,
  FETCH_FILTER_FKTP_LIST,
  FETCH_COUNT_FKTP,
  FETCH_COUNT_JENIS_FKTP,
  FETCH_FILTER_FKTP,
  FETCH_FILTER_FKTP_LIST_PUBLIK,
  FETCH_FILTER_FKTP_PUBLIK,

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



export const fetchFilterFKTPList= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => async (dispatch) => {
  try {
    const res = await FKTPService.getFilterFKTPlist(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKTP_LIST,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchFilterFKTP= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => async (dispatch) => {
  try {
    const res = await FKTPService.getFilterFKTP(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKTP,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchFilterFKTPListPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    const res = await FKTPService.getFilterFKTPlistPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKTP_LIST_PUBLIK,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchFilterFKTPPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    const res = await FKTPService.getFilterFKTPPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKTP_PUBLIK,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchCountJenisFKTP=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    const res = await FKTPService.countJenisFKTP(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_JENIS_FKTP,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};



export const fetchCountFKTP=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    const res = await FKTPService.countFKTP(pro,kab,kec,kdkc,kddep);
    dispatch({
      type: FETCH_COUNT_FKTP,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


// mapActions.js
import {
  FETCH_CENTER_CABANG,
  FETCH_BBOX_CABANG,
  FETCH_BBOX_KEDEPUTIAN,
  FETCH_CENTER_KEDEPUTIAN,
  FETCH_CENTER_WILAYAH,
  FETCH_AUTO_WILAYAH,
  FETCH_JENIS_FKRTL,
  FETCH_JENIS_FKTP,
  FETCH_CABANG,
  FETCH_WILAYAH_DEPUTI,
  FETCH_WILAYAH_CABANG,
  FETCH_KODE_DEPUTI,
  FETCH_CABANG_DEPUTI,
 
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
      payload: res.data.data.features[0].geometry.coordinates,
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

export const fetchCenterWilayah = (pro,kab) => async (dispatch) => {
  try {
    const res = await FilterService.getCenterWilayah(pro,kab);

    dispatch({
      type: FETCH_CENTER_WILAYAH,
      payload: res.data.data.features[0].geometry.coordinates,
    });
  } catch (err) {
    console.error(err);
  }
};
export const fetchAutoWilayah = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getAutoWilayah(id);

    dispatch({
      type: FETCH_AUTO_WILAYAH,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchCabang = (id) => async (dispatch) => {
  try {
    const res = await FilterService.getCabang(id);

    dispatch({
      type: FETCH_CABANG,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchCabangDeputi = (kddep,id) => async (dispatch) => {
  try {
    const res = await FilterService.getCabangDep(kddep,id);

    dispatch({
      type: FETCH_CABANG_DEPUTI,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};

export const fetchJenisFKRTL= () => async (dispatch) => {
  try {
    const res = await FilterService.getJenisFKRTL();

    dispatch({
      type: FETCH_JENIS_FKRTL,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchJenisFKTP= () => async (dispatch) => {
  try {
    const res = await FilterService.getJenisFKTP();

    dispatch({
      type: FETCH_JENIS_FKTP,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchAutoWilayahDeputi = (kddep,id) => async (dispatch) => {
  try {
    const res = await FilterService.getAutoWilayahDep(kddep,id);

    dispatch({
      type: FETCH_WILAYAH_DEPUTI,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};




export const fetchAutoWilayahCabang = (kddep,kdkc,id) => async (dispatch) => {
  try {
    const res = await FilterService.getAutoWilayahCaDep(kddep,kdkc,id);

    dispatch({
      type: FETCH_WILAYAH_CABANG,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
};


export const fetchKodeDep = (kdkc) => async (dispatch) => {
  try {
    const res = await FilterService.getKodeDep(kdkc);

    dispatch({
      type: FETCH_KODE_DEPUTI,
      payload: res.data.data,
    });
  } catch (err) {
    console.error(err);
  }
}
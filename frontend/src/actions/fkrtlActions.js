import {
  FETCH_FKRTL_REQUEST,
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
  SHOW_LOADING,
  CLEAR_DATA_FKRTL
} from "./types";

import FKRTLService from "../services/fkrtlService";

export const fetchMarkersFKRTL = (lat, lon) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFKRTL(lat, lon);
    dispatch({
      type: FETCH_MARKER_FKRTL,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};

export const fetchFKRTLCabang = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFKRTLCabang(id);
    dispatch({
      type: FETCH_FKRTL_CABANG,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};

export const fetchFKRTLKedeputian = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFKRTLKedeputian(id);
    dispatch({
      type: FETCH_FKRTL_KEDEPUTIAN,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
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
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFilterFKRTL(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKRTL,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};



export const fetchFilterFKRTLList= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page) => async (dispatch) => {
  dispatch({
    type: FETCH_FKRTL_REQUEST,
    payload: true,
  });
  try {

    const res = await FKRTLService.getFilterFKRTLlist(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page);

    dispatch({
      type: FETCH_FILTER_FKRTL_LIST,
      payload: {
        data: res.data.data,
        metadata: res.data.metadata,
      },
    });

  
  } catch (err) {
    console.error(err);

   
  }
};


export const fetchFilterFKRTLPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFilterFKRTLPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKRTL_PUBLIK,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};

export const fetchFilterFKRTLListPublik= (pro,kab,kec) => async (dispatch) => {
  try {

    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.getFilterFKRTLlistPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKRTL_LIST_PUBLIK,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};

export const fetchCountJenisFKRTL=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.countJenisFKRTL(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_JENIS_FKRTL,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};

export const fetchCountFKRTL=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {

    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKRTLService.countFKRTL(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_FKRTL,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: SHOW_LOADING,
      payload: false,
    });
  }
};



export const clearDataFKRTL = () => ({
  type: CLEAR_DATA_FKRTL,
});

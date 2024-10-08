// mapActions.js
import {
  FETCH_FKTP_REQUEST,
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
  SHOW_LOADING,
  CLEAR_DATA_FKTP
} from "./types";

import FKTPService from "../services/fktpService";

export const fetchMarkersFKTP = (lat, lon) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.getFKTP(lat, lon);
    dispatch({
      type: FETCH_MARKER_FKTP,
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

export const fetchFKTPCabang = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.getFKTPCabang(id);
    dispatch({
      type: FETCH_FKTP_CABANG,
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


export const fetchFKTPKedeputian = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });
    const res = await FKTPService.getFKTPKedeputian(id);
    dispatch({
      type: FETCH_FKTP_KEDEPUTIAN,
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

export const fetchFKTPList = (page, limit) => async (dispatch) => {
  try {
    const res = await FKTPService.getFKTPList(page, limit);

    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    dispatch({
      type: FETCH_FKTP_LIST,
      payload: res.data.data,
    });

    dispatch({
      type: SHOW_LOADING,
      payload: false,
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



export const fetchFilterFKTPList= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page) => async (dispatch) => {
  dispatch({
    type: FETCH_FKTP_REQUEST,
    payload: true,
  });

  try {
    const res = await FKTPService.getFilterFKTPlist(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page);

    dispatch({
      type: FETCH_FILTER_FKTP_LIST,
      payload: {
        data: res.data.data,
        metadata: res.data.metadata,
      },
    });
  } catch (err) {
    console.error(err);

  }
  
};



export const fetchFilterFKTP= (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });
    const res = await FKTPService.getFilterFKTP(pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk);

    dispatch({
      type: FETCH_FILTER_FKTP,
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

export const fetchFilterFKTPListPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.getFilterFKTPlistPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKTP_LIST_PUBLIK,
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



export const fetchFilterFKTPPublik= (pro,kab,kec) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.getFilterFKTPPublik(pro,kab,kec);

    dispatch({
      type: FETCH_FILTER_FKTP_PUBLIK,
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


export const fetchCountJenisFKTP=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.countJenisFKTP(pro,kab,kec,kdkc,kddep);

    dispatch({
      type: FETCH_COUNT_JENIS_FKTP,
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



export const fetchCountFKTP=(pro,kab,kec,kdkc,kddep) => async (dispatch) => {
  try {

    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });

    const res = await FKTPService.countFKTP(pro,kab,kec,kdkc,kddep);
    dispatch({
      type: FETCH_COUNT_FKTP,
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

export const clearDataFKTP = () => ({
  type: CLEAR_DATA_FKTP,
});

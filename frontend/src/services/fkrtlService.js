import axios from "../api/axios";
import authHeader from "./auth-header";



const getFKRTL = (lat,lon) => {
  return axios.get(`/fkrtl/${lat}/${lon}`, { headers: authHeader() });
};

const getFKRTLDetail = (id) => {
  return axios.get(`/fkrtl/${id}`, { headers: authHeader() });
};

const getFKRTLCabang = (id) => {
  return axios.get(`/fkrtl-cabang/${id}`, { headers: authHeader() });
};

const getFKRTLKedeputian = (id) => {
  return axios.get(`/fkrtl-kedeputian/${id}`, { headers: authHeader() });
};



const getFilterFKRTL = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => {
  return axios.get(`/filter-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}`, { headers: authHeader() });
};

  const getFilterFKRTLlist = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page) => {
    return axios.get(`/filter-fkrtl-list/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}/${page}`, { headers: authHeader() });
  };

  const getFilterFKRTLPublik = (pro,kab,kec) => {
    return axios.get(`/filter-fkrtl-publik/${pro}/${kab}/${kec}`, { headers: authHeader() });
  };
  
    const getFilterFKRTLlistPublik = (pro,kab,kec) => {
      return axios.get(`/filter-fkrtl-list-publik/${pro}/${kab}/${kec}`, { headers: authHeader() });
    };

  const countJenisFKRTL = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}`, { headers: authHeader() });
  };

  const countFKRTL = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}`, { headers: authHeader() });
  };



const FKRTLService = {
  getFKRTL,
  getFKRTLDetail,
  getFKRTLCabang,
  getFKRTLKedeputian,
  countJenisFKRTL,
  getFilterFKRTLlist,
  getFilterFKRTL,
  getFilterFKRTLPublik,
  getFilterFKRTLlistPublik,
  countFKRTL
};

export default FKRTLService;

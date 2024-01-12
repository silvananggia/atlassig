import axios from "../api/axios";
import authHeader from "./auth-header";



const getFKTP = (lat,lon) => {
  return axios.get(`/fktp/${lat}/${lon}`, { headers: authHeader() });
};

const getFKTPDetail = (id) => {
  return axios.get(`/fktp/${id}`, { headers: authHeader() });
};

const getFKTPCabang = (id) => {
  return axios.get(`/fktp-cabang/${id}`, { headers: authHeader() });
};

const getFKTPKedeputian = (id) => {
  return axios.get(`/fktp-kedeputian/${id}`, { headers: authHeader() });
};


const getFilterFKTP = (pro,kab,kec,kdkc,kddep,rmax,rmin,jenis,nmppk,alamatppk) => {
  return axios.get(`/filter-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${rmax}/${rmin}/${jenis}/${nmppk}/${alamatppk}`, { headers: authHeader() });
};


const getFilterFKTPlist = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk,page) => {
  return axios.get(`/filter-fktp-list/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}/${page}`, { headers: authHeader() });
};

const getFilterFKTPPublik = (pro,kab,kec) => {
  return axios.get(`/filter-fktp-publik/${pro}/${kab}/${kec}`, { headers: authHeader() });
};


const getFilterFKTPlistPublik = (pro,kab,kec) => {
  return axios.get(`/filter-fktp-list-publik/${pro}/${kab}/${kec}`, { headers: authHeader() });
};



  const countJenisFKTP = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}`, { headers: authHeader() });
  };

  const countFKTP = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}`, { headers: authHeader() });
  };




const FKTPService = {
  getFKTP,
  getFKTPDetail,
  getFKTPCabang,
  getFKTPKedeputian,
  getFilterFKTP,
  getFilterFKTPlist,
  countJenisFKTP,
  getFilterFKTPPublik,
  getFilterFKTPlistPublik,
  countFKTP,
};

export default FKTPService;

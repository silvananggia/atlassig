import axios from "../api/axios";
import authHeader from "./auth-header";



const getFKTP = (lat,lon) => {
  return axios.get(`/fktp/${lat}/${lon}`, { headers: authHeader() });
};

const getFKTPDetail = (id) => {
  return axios.get(`/fktp/${id}`);
};

const getFKTPCabang = (id) => {
  return axios.get(`/fktp-cabang/${id}`);
};

const getFKTPKedeputian = (id) => {
  return axios.get(`/fktp-kedeputian/${id}`);
};


const getFilterFKTP = (pro,kab,kec,kdkc,kddep,rmax,rmin,jenis,nmppk,alamatppk) => {
  return axios.get(`/filter-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${rmax}/${rmin}/${jenis}/${nmppk}/${alamatppk}`);
};


const getFilterFKTPlist = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => {
  return axios.get(`/filter-fktp-list/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}`);
};

const getFilterFKTPPublik = (pro,kab,kec) => {
  return axios.get(`/filter-fktp-publik/${pro}/${kab}/${kec}`);
};


const getFilterFKTPlistPublik = (pro,kab,kec) => {
  return axios.get(`/filter-fktp-list-publik/${pro}/${kab}/${kec}`);
};



  const countJenisFKTP = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
  };

  const countFKTP = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
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

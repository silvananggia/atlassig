import axios from "../api/axios";

const getFKRTLList = (page,limit) => {
  return axios.get(`/fkrtl/${page}/${limit}`);
};

const getFKRTL = (lat,lon) => {
  return axios.get(`/fkrtl/${lat}/${lon}`);
};

const getFKRTLDetail = (id) => {
  return axios.get(`/fkrtl/${id}`);
};

const getFKRTLCabang = (id) => {
  return axios.get(`/fkrtl-cabang/${id}`);
};

const getFKRTLKedeputian = (id) => {
  return axios.get(`/fkrtl-kedeputian/${id}`);
};



const getFilterFKRTL = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => {
  return axios.get(`/filter-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}`);
};

  const getFilterFKRTLlist = (pro,kab,kec,kdkc,kddep,krs,canggih,jenis,nmppk,alamatppk) => {
    return axios.get(`/filter-fkrtl-list/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${jenis}/${nmppk}/${alamatppk}`);
  };

  const getFilterFKRTLPublik = (pro,kab,kec) => {
    return axios.get(`/filter-fkrtl-publik/${pro}/${kab}/${kec}`);
  };
  
    const getFilterFKRTLlistPublik = (pro,kab,kec) => {
      return axios.get(`/filter-fkrtl-list-publik/${pro}/${kab}/${kec}`);
    };

  const countJenisFKRTL = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
  };

  const countFKRTL = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
  };



const FKRTLService = {
  getFKRTLList,
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

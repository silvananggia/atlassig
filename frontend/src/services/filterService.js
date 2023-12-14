import axios from "../api/axios";

const getBBOXKabupaten = (id) => {
  return axios.get(`/bbox-kabupaten/${id}`);
};

const getBBOXCabang = (id) => {
  return axios.get(`/bbox-cabang/${id}`);
};

const getCenterCabang = (id) => {
  return axios.get(`/center-cabang/${id}`);
};

const getBBOXKedeputian = (id) => {
  return axios.get(`/bbox-kedeputian/${id}`);
};

const getCenterKedeputian = (id) => {
  return axios.get(`/center-kedeputian/${id}`);
};

const getAutoWilayah = (id) => {
  return axios.get(`/autowilayah/${id}`);
};

const getJenisFKTP = () => {
  return axios.get(`/list-jenis-fktp`);
};

const getJenisFKRTL = () => {
  return axios.get(`/list-jenis-fkrtl`);
};

const getWilayahAdmin = (pro,kab,kec) => {
  return axios.get(`/wilayahadmin/${pro}/${kab}/${kec}`);
};

const getWilayahCanggih= (pro,kab,kec,id) => {
  return axios.get(`/wilayahadmin-canggih/${pro}/${kab}/${kec}/${id}`);
};

const getFilterFKTP = (pro,kab,kec,kdkc,kddep,rmax,rmin,nmppk,alamatppk) => {
  return axios.get(`/filter-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${rmax}/${rmin}/${nmppk}/${alamatppk}`);
};

const getFilterFKRTL = (pro,kab,kec,kdkc,kddep,krs,canggih,nmppk,alamatppk) => {
  return axios.get(`/filter-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${nmppk}/${alamatppk}`);
};

const getFilterFKTPlist = (nmppk) => {
  return axios.get(`/filter-fktp-list/${nmppk}`);
};


const getFilterFKRTLlist = (pro,kab,kec,kdkc,kddep,krs,canggih,nmppk,alamatppk) => {
    return axios.get(`/filter-fkrtl-list/${pro}/${kab}/${kec}/${kdkc}/${kddep}/${krs}/${canggih}/${nmppk}/${alamatppk}`);
  };

  const countJenisFKRTL = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fkrtl/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
  };

  const countJenisFKTP = (pro,kab,kec,kdkc,kddep) => {
    return axios.get(`/count-jenis-fktp/${pro}/${kab}/${kec}/${kdkc}/${kddep}`);
  };


const FilterService = {
  getBBOXKabupaten,
  getBBOXCabang,
  getCenterCabang,
  getBBOXKedeputian,
  getCenterKedeputian,
  getAutoWilayah,
  getWilayahAdmin,
  getWilayahCanggih,
  getFilterFKTP,
  getFilterFKRTL,
  getJenisFKTP,
  getJenisFKRTL,
  getFilterFKTPlist,
  getFilterFKRTLlist,
  countJenisFKRTL,
  countJenisFKTP

};

export default FilterService;

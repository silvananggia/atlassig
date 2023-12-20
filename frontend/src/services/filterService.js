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

const getCabang = (id) => {
  return axios.get(`/get-cabang/${id}`);
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

const getAutoWilayahCaDep = (kddep,kdkc,id) => {
  return axios.get(`/autowilayahcadep/${kddep}/${kdkc}/${id}`);
};


const getAutoWilayahDep = (kddep,id) => {
  return axios.get(`/autowilayahdep/${kddep}/${id}`);
};

const getCabangDep = (kddep,id) => {
  return axios.get(`/get-cabangdep/${kddep}/${id}`);
};


const getKodeDep = (kdkc) => {
  return axios.get(`/get-kodedep/${kdkc}`);
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
  getJenisFKTP,
  getJenisFKRTL,
  getCabang,
  getAutoWilayahCaDep,
  getCabangDep,
  getAutoWilayahDep,
  getKodeDep

};

export default FilterService;

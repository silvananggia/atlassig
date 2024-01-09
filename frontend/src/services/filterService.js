import axios from "../api/axios";
import authHeader from "./auth-header";

const getBBOXKabupaten = (id) => {
  return axios.get(`/bbox-kabupaten/${id}`, { headers: authHeader() });
};

const getBBOXCabang = (id) => {
  return axios.get(`/bbox-cabang/${id}`, { headers: authHeader() });

};

const getCenterCabang = (id) => {
  return axios.get(`/center-cabang/${id}`, { headers: authHeader() });

};

const getBBOXKedeputian = (id) => {
  return axios.get(`/bbox-kedeputian/${id}`, { headers: authHeader() });
};

const getCenterKedeputian = (id) => {
  return axios.get(`/center-kedeputian/${id}`, { headers: authHeader() });
};

const getCenterWilayah = (pro,kab) => {
  return axios.get(`/center-wilayah/${pro}/${kab}`, { headers: authHeader() });
};


const getAutoWilayah = (id) => {
  return axios.get(`/autowilayah/${id}`, { headers: authHeader() });
};

const getCabang = (id) => {
  return axios.get(`/get-cabang/${id}`, { headers: authHeader() });
};


const getJenisFKTP = () => {
  return axios.get(`/list-jenis-fktp`, { headers: authHeader() });
};

const getJenisFKRTL = () => {
  return axios.get(`/list-jenis-fkrtl`, { headers: authHeader() });
};

const getWilayahAdmin = (pro,kab,kec) => {
  return axios.get(`/wilayahadmin/${pro}/${kab}/${kec}`, { headers: authHeader() });
};

const getWilayahCanggih= (pro,kab,kec,id) => {
  return axios.get(`/wilayahadmin-canggih/${pro}/${kab}/${kec}/${id}`, { headers: authHeader() });
};

const getAutoWilayahCaDep = (kddep,kdkc,id) => {
  return axios.get(`/autowilayahcadep/${kddep}/${kdkc}/${id}`, { headers: authHeader() });
};


const getAutoWilayahDep = (kddep,id) => {
  return axios.get(`/autowilayahdep/${kddep}/${id}`, { headers: authHeader() });
};

const getCabangDep = (kddep,id) => {
  return axios.get(`/get-cabangdep/${kddep}/${id}`, { headers: authHeader() });
};


const getKodeDep = (kdkc) => {
  return axios.get(`/get-kodedep/${kdkc}`, { headers: authHeader() });
};

const FilterService = {
  getBBOXKabupaten,
  getBBOXCabang,
  getCenterCabang,
  getBBOXKedeputian,
  getCenterKedeputian,
  getCenterWilayah,
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

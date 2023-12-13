import axios from "../api/axios";

const getFKTPList = (page,limit) => {
  return axios.get(`/fktp/${page}/${limit}`);
};

const getFKTP = (lat,lon) => {
  return axios.get(`/fktp/${lat}/${lon}`);
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



const FKTPService = {
  getFKTP,
  getFKTPDetail,
  getFKTPCabang,
  getFKTPKedeputian,
  getFKTPList,
};

export default FKTPService;

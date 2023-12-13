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


const FKRTLService = {
  getFKRTLList,
  getFKRTL,
  getFKRTLDetail,
  getFKRTLCabang
};

export default FKRTLService;

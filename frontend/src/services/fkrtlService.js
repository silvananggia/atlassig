import axios from "../api/axios";

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
  getFKRTL,
  getFKRTLDetail,
  getFKRTLCabang
};

export default FKRTLService;

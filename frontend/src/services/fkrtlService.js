import axios from "../api/axios";

const getFKRTL = (lat,lon) => {
  return axios.get(`/fkrtl`, {
    params: {
      lat,
      lon,
    },
  });
};

const FKRTLService = {
  getFKRTL,

};

export default FKRTLService;

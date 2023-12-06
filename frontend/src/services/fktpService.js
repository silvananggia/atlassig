import axios from "../api/axios";

const getFKTP = (lat,lon) => {
  return axios.get(`/fktp`, {
    params: {
      lat,
      lon,
    },
  });
};

const FKTPService = {
  getFKTP,
};

export default FKTPService;

import axios from "../api/axios";

const getFKTP = () => {
  return axios.get(`/fktp`);
};

const FKTPService = {
  getFKTP,

};

export default FKTPService;

import axios from "../api/axios";
import authHeader from "./auth-header";

const checkAuthEmbed = () => {
  return axios.get(`/checkAuthEmbed`);
};

const getLocationEmbed = (id) => {
  return axios.get(`/getEmbed/${id}`, {
    withCredentials: true,
  });
};

const accessService = {
  checkAuthEmbed,
  getLocationEmbed,

};

export default accessService;

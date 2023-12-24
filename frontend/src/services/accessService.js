import axios from "../api/axios";

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

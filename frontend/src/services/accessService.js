import axios from "../api/axios";

const getLocationEmbed = (id) => {
  return axios.get(`/getEmbed/${id}`);
};

const accessService = {
  getLocationEmbed,

};

export default accessService;

import axios from "../api/axios";

const getBBOXKabupaten = (id) => {
  return axios.get(`/bbox-kabupaten/${id}`);
};

const getBBOXCabang = (id) => {
  return axios.get(`/bbox-cabang/${id}`);
};

const getCenterCabang = (id) => {
  return axios.get(`/center-cabang/${id}`);
};



const FilterService = {
  getBBOXKabupaten,
  getBBOXCabang,
  getCenterCabang,
};

export default FilterService;

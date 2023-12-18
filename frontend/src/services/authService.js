import axios from "../api/axios";

const login = (email,password) => {
  console.log(email);
  return axios.post(`/login`, {
    email,
    password,
});
};

const checkAuth = () => {
  return axios.get(`/checkAuth`
  );
  
};


const logout = () => {
  return axios.get(`/logout`
  );
  
};


const authService = {
  login,
  checkAuth,
  logout

};

export default authService;

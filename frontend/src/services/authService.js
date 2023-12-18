import axios from "../api/axios";

const login = (email, password) => {
  console.log(email);
  return axios.post(`/login`, {
    email,
    password,
  }, {
    withCredentials: true,
  });
};


const checkAuth = () => {
  return axios.get(`/checkAuth`, {
    withCredentials: true,
  }
  );
  
};


const logout = () => {
  return axios.get(`/logout`, {
    withCredentials: true,
  }
  );
  
};


const authService = {
  login,
  checkAuth,
  logout

};

export default authService;

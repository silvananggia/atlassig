import axios from "../api/axios";

const login = (email, password) => {
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
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  return axios.post(
    "/logout",
    {},
    {
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

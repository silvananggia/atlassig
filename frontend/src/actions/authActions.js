// mapActions.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, CHECK_AUTH, LOGOUT } from "./types";

import authService from "../services/authService";

export const fetchLogin = (email, password) => async (dispatch) => {
  try {
    const res = await authService.login(email, password);
    //  console.log(res);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: "Periksa Kembali Email dan Password Anda" });
  }

  
};

export const checkAuth = () => async (dispatch) => {
  try {
    const res = await authService.checkAuth();
    dispatch({
     type: CHECK_AUTH, 
     payload: res.data });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE });
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await authService.logout();
    dispatch({
     type: LOGOUT, 
     payload: res.data });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};
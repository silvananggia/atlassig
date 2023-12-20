import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { checkAuth,logout } from "../actions/authActions";

function PrivateRoute({children}) {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
    },[dispatch, checkAuth])
  
;
  
  const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);
  //console.log(isAuthenticated)
  return isAuthenticated ? 
  <Layout>  {children} </Layout>

  : (
    <Navigate to="/login" replace={true} />
  );
}

export default PrivateRoute;
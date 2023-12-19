// PrivateRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';

function PrivateRoute({children}) {

  const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);
  return isAuthenticated ? 
  <Layout>  {children} </Layout>

  : (
    <Navigate to="/login" replace={true} />
  );
}

export default PrivateRoute;
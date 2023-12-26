import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { checkAuth } from "../actions/authActions";

function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);

  useEffect(() => {
    const checkAuthentication = async () => {
      await dispatch(checkAuth());
      setLoading(false);
    };

    checkAuthentication();
  }, [dispatch]);


  if (loading) {
    // Render a loading indicator or null while checking authentication
    return null;
  }

  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace={true} />
  );
}



export default PrivateRoute;

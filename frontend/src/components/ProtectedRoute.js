import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    // Redirect to the login page or any other route
    navigate('/login');
    // You can also use replace() instead of navigate() to replace the current entry in the navigation stack
  }

  return <Route {...rest} element={<Component />} />;
};

export default ProtectedRoute;

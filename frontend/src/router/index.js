import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";

import Layout from "../layouts/Layout";
import LoginPage from "../components/Login";
import MapPage from "../components/dashboard/MapDashboard";
import MapFKRTL from "../components/dashboard/MapDashboardFKRTL";
import EmbedPage from "../components/embed/MapEmbed";
import StaisticsPage from "../components/statistic/StatisticsPage";
import NotFound from "../components/NotFound";
import PrivateRoute from "./PrivateRoute";

function MyRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="embed/:code" element={<EmbedPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <MapPage faskes={"fktp"} />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="mapfktp"
        element={
          <PrivateRoute>
            <MapPage faskes={"fktp"} />
          </PrivateRoute>
        }
      />
      <Route
        path="mapfkrtl"
        element={
          <PrivateRoute>
            <MapFKRTL />
          </PrivateRoute>
        }
      />
      <Route
        path="statistic"
        element={
          <PrivateRoute>
            <StaisticsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MyRouter;

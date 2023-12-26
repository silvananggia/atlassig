import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import LoadingIndicator from "../components/loading/Loading";


const LazyLoginPage = lazy(() => import("../components/Login"));
const LazyMapPage = lazy(() => import("../components/dashboard/MapDashboard"));
const LazyMapFKRTL = lazy(() => import("../components/dashboard/MapDashboardFKRTL"));
const LazyEmbedPage = lazy(() => import("../components/embed/MapEmbed"));
const LazyStatisticsPage = lazy(() => import("../components/statistic/StatisticsPage"));
const LazyNotFound = lazy(() => import("../components/NotFound"));
const LazyPrivateRoute = lazy(() => import("./PrivateRoute"));

function MyRouter() {
  return (
    <Routes>
      <Route path="login" element={<Suspense fallback={<LoadingIndicator />}><LazyLoginPage /></Suspense>} />
      <Route path="embed/:code" element={<Suspense fallback={<LoadingIndicator />}><LazyEmbedPage /></Suspense>} />

      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <LazyPrivateRoute>
              <LazyMapPage faskes={"fktp"} />
            </LazyPrivateRoute>
          </Suspense>
        }
      ></Route>
      <Route
        path="mapfktp"
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <LazyPrivateRoute>
              <LazyMapPage faskes={"fktp"} />
            </LazyPrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="mapfkrtl"
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <LazyPrivateRoute>
              <LazyMapFKRTL />
            </LazyPrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="statistic"
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <LazyPrivateRoute>
              <LazyStatisticsPage />
            </LazyPrivateRoute>
          </Suspense>
        }
      />

      <Route path="*" element={<Suspense fallback={<LoadingIndicator />}><LazyNotFound /></Suspense>} />
    </Routes>
  );
}

export default MyRouter;

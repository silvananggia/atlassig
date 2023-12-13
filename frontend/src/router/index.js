// MyRouter.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from '../layouts/Layout';
import LoginPage from '../components/Login';
import MapPage from '../components/dashboard/MapDashboard';
import EmbedPage from '../components/embed/MapEmbed';
import EmbedCabangPage from '../components/embed/MapCabang';
import EmbedPublikPage from '../components/embed/MapPublik';
import StaisticsPage from '../components/statistic/StatisticsPage';
import NotFound from '../components/NotFound';

function MyRouter() {
  return (

<Routes>
<Route path="login" element={<LoginPage />} />
<Route path="embed/:code" element={<EmbedPage />} />
<Route path="embedCabang" element={<EmbedCabangPage />} />
<Route path="embedPublik" element={<EmbedPublikPage />} />



<Route path="/" element={<Layout />}>
    <Route index element={<MapPage />} />
    <Route path="map" element={<MapPage />} />
    <Route path="statistic" element={<StaisticsPage />} />
    
</Route>

<Route path="*" element={<NotFound/>} />
</Routes>
  );
}

export default MyRouter;

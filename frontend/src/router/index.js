// MyRouter.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from '../layouts/Layout';
import LoginPage from '../components/Login';
import MapPage from '../components/MapDashboard';
import EmbedPage from '../components/embed/MapEmbed';
import EmbedPage2 from '../components/embed/MapEmbed2';
import StaisticsPage from '../components/StatisticsPage';

function MyRouter() {
  return (

<Routes>
<Route path="login" element={<LoginPage />} />
<Route path="embed" element={<EmbedPage />} />
<Route path="embed2" element={<EmbedPage2 />} />

<Route path="/" element={<Layout />}>
    <Route index element={<MapPage />} />
    <Route path="map" element={<MapPage />} />
    <Route path="statistic" element={<StaisticsPage />} />
    
</Route>
</Routes>
  );
}

export default MyRouter;

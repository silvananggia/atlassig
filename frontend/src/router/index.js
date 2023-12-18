// MyRouter.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from '../layouts/Layout';
import LoginPage from '../components/Login';
import MapPage from '../components/dashboard/MapDashboard';
import EmbedPage from '../components/embed/MapEmbed';
import StaisticsPage from '../components/statistic/StatisticsPage';
import NotFound from '../components/NotFound';

function MyRouter() {
  return (

<Routes>
<Route path="login" element={<LoginPage />} />
<Route path="embed/:code" element={<EmbedPage />} />

<Route path="/" element={<Layout />}>
    <Route index element={<MapPage faskes={"fktp"} />} />
    <Route path="mapfktp" element={<MapPage faskes={"fktp"}/>} />
    <Route path="mapfkrtl" element={<MapPage faskes={"fkrtl"}/>} />
    <Route path="statistic" element={<StaisticsPage />} />
    
</Route>

<Route path="*" element={<NotFound/>} />
</Routes>
  );
}

export default MyRouter;

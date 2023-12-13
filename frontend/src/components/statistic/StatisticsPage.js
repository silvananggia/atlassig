import React from 'react';
import {Box, Grid} from "@mui/material";
import BarChart from "./ChartBar";
import PieChart from "./ChartPie";

const StatisticsPage = () => {
  

  return (
    <Box className="contentRoot" m={2}>
      <h1>Statistik</h1>

      <Grid container spacing={2}>
      <Grid item xs={6} md={4}>
          <Box  p={2}>
          <BarChart /> 
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box  p={2}>
          <BarChart />
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box  p={2}>
            <PieChart/>
          </Box>
        </Grid>
        
      </Grid>
      
    </Box>
  );
};

export default StatisticsPage;

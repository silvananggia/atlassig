import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  setLoading,

} from "../actions/loadingActions";
const NotFound = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setLoading(false));
  },[])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1">
              404
            </Typography>
            <Typography variant="h6">
              The page you’re looking for doesn’t exist.
            </Typography>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default NotFound;

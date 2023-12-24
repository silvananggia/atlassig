import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { connect, useDispatch,useSelector } from "react-redux";
import {Box, Typography} from "@mui/material";

import { fetchEmbedFaskes } from "../../actions/accessActions";

import MapCalonFaskes from "./MapCalon";
import MapPublik from "./MapPublik";
import MapCabang from "./MapCabang";
import MapKedeputian from "./MapKedeputian";
import {
  setLoading,

} from "../../actions/loadingActions";
const MapComponent = () => {
  const dispatch = useDispatch();
  const { code } = useParams();
  const [canAccess, setCanAccess] = useState(false);
  const [wait, setWait] = useState(true); // Define the 'loading' variable


  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEmbedFaskes(code));
    };
    fetchData();
   
  }, [dispatch, code]);

  const accessEmbed = useSelector((state) => state.mapaccess.dataobj);

  useEffect(() => {
    if (accessEmbed.status === "success") {
      setCanAccess(true);
    } else {
      setCanAccess(false);
    }
    setWait(false);
  }, [accessEmbed]);

  useEffect(()=>{
    dispatch(setLoading(false));
  },[])


  
  return (
    <Box className="contentRoot">
      {canAccess ? (
        <div>
        {accessEmbed.data.level === "CalonFaskes" ? (
          <MapCalonFaskes
            latitude={accessEmbed.data.lat}
            longitude={accessEmbed.data.lon}
            faskes={accessEmbed.data.faskes}
            potensi={accessEmbed.data.potensi}
          />
        ) : accessEmbed.data.level === "Kedeputian" ? (
          <MapKedeputian
            kodeKedeputian={accessEmbed.data.kodeKedeputian}
            faskes={accessEmbed.data.faskes}
          />
        ) :  accessEmbed.data.level === "Cabang" ? (
          <MapCabang
            kodeCabang={accessEmbed.data.kodeCabang}
            faskes={accessEmbed.data.faskes}
          />
        ) :  accessEmbed.data.level === "Publik" ? (
          <MapPublik
            latitude={accessEmbed.data.lat}
            longitude={accessEmbed.data.lon}
            faskes={accessEmbed.data.faskes}
          />
        ) : (
          <div>
            {" "}
            {/* Render an error message or redirect to an error page if the token is invalid */}
            <h1>Error: Invalid Map Token</h1>
            <Typography>Please contact support for assistance.</Typography>
          </div>
        )}
      </div>
      ) : !wait ? (
        <div>
          <h1>Error: Invalid Map Token</h1>
          <Typography>Please contact support for assistance.</Typography>
        </div>
      ) : null}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapaccess: state.mapaccess,
  };
};

export default connect(mapStateToProps)(MapComponent);

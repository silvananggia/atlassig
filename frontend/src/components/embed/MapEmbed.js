import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { connect, useDispatch,useSelector } from "react-redux";
import Box from "@mui/material/Box";

import { fetchEmbedFaskes } from "../../actions/accessActions";

import MapCalonFaskes from "./Map";
import MapPublik from "./MapPublik";
import MapCabang from "./MapCabang";

const MapComponent = () => {
  const dispatch = useDispatch();
  const { code } = useParams();
  const [canAccess, setCanAccess] = useState(false);

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
  }, [accessEmbed]);

  return (
    <Box className="contentRoot">
      {canAccess ? (
        <div>
        {accessEmbed.data.level === "CalonFaskes" ? (
          <MapCalonFaskes
            latitude={accessEmbed.data.lat}
            longitude={accessEmbed.data.lon}
            faskes={accessEmbed.data.faskes}
          />
        ) : accessEmbed.data.level === "Kedeputian" ? (
          <MapCabang
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
            <p>Please contact support for assistance.</p>
          </div>
        )}
      </div>
      ) : (
        <div>
          {" "}
          {/* Render an error message or redirect to an error page if the token is invalid */}
          <h1>Error: Invalid Map Token</h1>
          <p>Please contact support for assistance.</p>
        </div>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapaccess: state.mapaccess,
  };
};

export default connect(mapStateToProps)(MapComponent);

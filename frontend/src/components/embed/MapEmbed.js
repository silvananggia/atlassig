import React, { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

import { fetchEmbedFaskes } from "../../actions/accessActions";
import { setLoading } from "../../actions/loadingActions";
import LoadingIndicator from "../loading/Loading";

const LazyMapCalonFaskes = lazy(() => import("./MapCalon"));
const LazyMapKedeputian = lazy(() => import("./MapKedeputian"));
const LazyMapCabang = lazy(() => import("./MapCabang"));
const LazyMapPublik = lazy(() => import("./MapPublik"));

const MapComponent = () => {
  const dispatch = useDispatch();
  const { code } = useParams();
  const [canAccess, setCanAccess] = useState(false);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      localStorage.setItem("token", code);
      try {
        await dispatch(fetchEmbedFaskes(code));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show an error message)
      } finally {
        dispatch(setLoading(false));
        setWait(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic (if needed)
    };
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
        <Suspense fallback={<LoadingIndicator />}>
          {accessEmbed.data.level === "CalonFaskes" ? (
            <LazyMapCalonFaskes
              latitude={accessEmbed.data.lat}
              longitude={accessEmbed.data.lon}
              faskes={accessEmbed.data.faskes}
              potensi={accessEmbed.data.potensi}
            />
          ) : accessEmbed.data.level === "Kedeputian" ? (
            <LazyMapKedeputian
              kodeKedeputian={accessEmbed.data.kodeKedeputian}
              faskes={accessEmbed.data.faskes}
            />
          ) : accessEmbed.data.level === "Cabang" ? (
            <LazyMapCabang
              kodeCabang={accessEmbed.data.kodeCabang}
              faskes={accessEmbed.data.faskes}
            />
          ) : accessEmbed.data.level === "Publik" ? (
            <LazyMapPublik
              latitude={accessEmbed.data.lat}
              longitude={accessEmbed.data.lon}
              faskes={accessEmbed.data.faskes}
            />
          ) : (
            <div>
              <h1>Error: Invalid Map Token</h1>
              <Typography>Please contact support for assistance.</Typography>
            </div>
          )}
        </Suspense>
      ) : wait ?(
        <LoadingIndicator />
      ): (
        <div>
          <h1>Error: Invalid Map Token</h1>
          <Typography>Please contact support for assistance.</Typography>
        </div>
      ) }
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapaccess: state.mapaccess,
  };
};

export default connect(mapStateToProps)(MapComponent);

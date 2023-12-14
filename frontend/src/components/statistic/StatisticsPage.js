import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { fetchAutoWilayah,fetchCountFKRTL,fetchCountFKTP } from "../../actions/filterActions";

import BarChart from "./ChartBar";
import PieChart from "./ChartPie";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const [selectedWilayah, setselectedWilayah] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKabId, setSelectedKabId] = useState(null);
  const [selectedKecId, setSelectedKecId] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);

  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const dataFKTP = useSelector((state) => state.mapfilter.datalistfktp);
  const dataFKRTL = useSelector((state) => state.mapfilter.datalistfkrtl);

  const handleSubmit = () => {
    /*  dispatch(
      fetchFilterFKRTLList(
        selectedProvId,
        selectedKabId,
        selectedKecId,
       
      )
    ); */

    dispatch(
      fetchCountFKRTL(
        selectedProvId,
        selectedKabId,
        selectedKecId,
       "null",
       "null",
      )
    );

    dispatch(
      fetchCountFKTP(
        selectedProvId,
        selectedKabId,
        selectedKecId,
       "null",
       "null",
      )
    );

  };

  const handleSelectWilayah = (event, selectedOption) => {
    console.log("Selected Option:", selectedOption);
    if (selectedOption) {
      const { kec_id, kab_id, prov_id } = selectedOption;
      console.log("Kecamatan ID:", kec_id);
      console.log("Kabupaten ID:", kab_id);
      console.log("Provinsi ID:", prov_id);

      setSelectedKecId(kec_id);
      setSelectedKabId(kab_id);
      setSelectedProvId(prov_id);
      handleSubmit(); 
    }
  };

  const handleInputWilayahChange = (event, value) => {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      dispatch(fetchAutoWilayah([]));
    }
  };

  return (
    <Box className="contentRoot" m={2}>
      <h1>Statistik</h1>


      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <Box p={2}>
          <Autocomplete
                noOptionsText={"Data Tidak Ditemukan"}
                size={"small"}
                fullWidth
                id="combo-box-demo"
                value={selectedWilayah}
                onChange={handleSelectWilayah}
                inputValue={selectedWilayah}
                onInputChange={handleInputWilayahChange}
                options={listWilayah || []}
                getOptionLabel={(option) => option.disp}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Masukan minimal 3 karakter"
                    defaultValue=""
                  />
                )}
              />
          </Box>
        </Grid>
        <Grid item xs={6} md={2}>
          <Box p={2}>
          {/* <Button
                variant="contained"
                fullWidth
                size="medium"
                onClick={() => {
                  handleSubmit(); // Call the submission function
                }}
              >
                Terapkan
              </Button> */}
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box p={2}>
            
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <Box p={2}>
            <BarChart title="Jenis Fasilitas Kesehatan Tingkat Pertama" apiData={dataFKTP}/>
          </Box>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box p={2}>
            <BarChart title="JenisFasilitas Kesehatan Rujukan Tingkat Lanjut"apiData={dataFKRTL}/>
          </Box>
        </Grid>
        {/* <Grid item xs={6} md={4}>
          <Box p={2}>
            <PieChart />
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapfilter: state.mapfilter,
  };
};

export default connect(mapStateToProps)(StatisticsPage);
